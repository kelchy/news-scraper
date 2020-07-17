const request = require('request');
const cheerio = require('cheerio');
const child = require('child_process');
const db = require('../models');

class Classify {

  static async untagged(limit) {
    const articles = await db.Article.find({ tag: { '$exists': 0 } }, {}, { sort: { _id: -1 }, limit }).catch(e=>console.error(e));
    for (let article of articles) {
      if (article.link.slice(0, 4) != 'http') article.link = `https://${article.link}`;
      article.title = await cheer(article.link).catch(e=>console.error(e));
      const tag = await getTag(article.title).catch(e=>console.error(e));
      if (tag) {
        await db.Article.update({ _id: article._id }, { '$set': { tag } }).catch(e=>console.error(e));
        console.log(article.link, tag);
      }
    }
    return;
  }

}

function cheer(url) {
  return new Promise((resolve, reject) => {
    request(url, function (error, response, body) {
      if (error) return reject(error);
      if (response && response.statusCode != 200) return new Error(`Error: ${url} ${response.statusCode}`);
      const $ = cheerio.load(body);
      const title = $("head > title").text().trim();
      resolve(title);
    });
  });
}

async function puppe(url) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] }).catch(e=>console.error(e));
  const page = await browser.newPage().catch(e=>console.error(e));
  await page.goto(article.link, { waitUntil: 'domcontentloaded' }).catch(e=>console.error(e));
  const title = await page.title().catch(e=>console.error(e));
  browser.close().catch(e=>console.error(e));
  return title;
}

function getTag(title) {
  return new Promise((resolve, reject) => {
    if (!title) return null;
    let tag;
    title = title.replace(/"/g, '\\"');
    child.exec(`python3 ./predictor/predict.py "${title}"`, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      if (stdout) tag = stdout.trim().toLowerCase();
      resolve(tag);
    });
  });
}

module.exports = Classify;
