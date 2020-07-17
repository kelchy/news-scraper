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
      const tag = await ctrl.getTag(article.title).catch(e=>console.error(e));
      if (tag) {
        await db.Article.update({ _id: article._id }, { '$set': { tag } }).catch(e=>console.error(e));
        console.log(article.title, tag);
      }
    }
    return;
  }

}

module.exports = Classify;
