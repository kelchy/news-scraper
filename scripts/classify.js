const puppeteer = require('puppeteer');
const child = require('child_process');
const db = require('../models');

class Classify {

  static async untagged(limit) {
    const articles = await db.Article.find({ tag: { '$exists': 0 } }, {}, { sort: { _id: -1 }, limit }).catch(e=>console.error(e));
    for (let article of articles) {
      if (article.link.slice(0, 4) != 'http') article.link = `https://${article.link}`;
      const browser = await puppeteer.launch({ args: ['--no-sandbox'] }).catch(e=>console.error(e));
      const page = await browser.newPage().catch(e=>console.error(e));
      await page.goto(article.link, { waitUntil: 'networkidle2' }).catch(e=>console.error(e));
      article.title = await page.title().catch(e=>console.error(e));
      const tag = await getTag(article.title).catch(e=>console.error(e));
      browser.close().catch(e=>console.error(e));
      if (tag) {
        await db.Article.update({ _id: article._id }, { '$set': { tag } }).catch(e=>console.error(e));
        console.log(article.link, tag);
      }
    }
    return;
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

module.exports = Classify;
