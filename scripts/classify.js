const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const child = require('child_process');
const db = require('../models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news-scraper';
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

async function classify(limit) {
  const articles = await db.Article.find({ tag: { '$exists': 0 } }, {}, { sort: { _id: -1 }, limit }).catch(e=>console.error(e));
  for (article of articles) {
    if (article.link.slice(0, 4) != 'http') article.link = `https://${article.link}`;
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] }).catch(e=>console.error(e));
    const page = await browser.newPage().catch(e=>console.error(e));
    await page.goto(article.link, { waitUntil: 'networkidle2' }).catch(e=>console.error(e));
    article.title = await page.title().catch(e=>console.error(e));
    const tag = await getTag(article.title).catch(e=>console.error(e));
    if (tag) {
      await db.Article.update({ _id: article._id }, { '$set': { tag } }).catch(e=>console.error(e));
      console.log(article.link, tag);
    }
  }
}

function getTag(title) {
  return new Promise((resolve, reject) => {
    let tag;
    child.exec(`python3 ./predictor/predict.py "${title}"`, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      if (stdout) tag = stdout.trim().toLowerCase();
      resolve(tag);
    });
  });
}

classify(10).then(()=>process.exit(1));
