const child = require('child_process');
const db = require('../models');
const ctrl = require('../controllers/articleController');

class Classify {

  static async untagged(limit) {
    const articles = await db.Article.find({ tag: { '$exists': 0 } }, {}, { sort: { _id: -1 }, limit }).catch(e=>console.error(e));
    for (let article of articles) {
      if (!article.title) {
          if (article.link.slice(0, 4) != 'http') article.link = `https://${article.link}`;
          article.title = await ctrl.urlTitle(article.link).catch(e=>console.error(e));
      }
      const tag = await getTag(article.title).catch(e=>console.error(e));
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
