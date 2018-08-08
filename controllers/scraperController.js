const phantom = require('phantom');
const cheerio = require('cheerio');

// MSNBC specific helper fns
const modifyMsnbcArticleTitle = (title) => {
  if (!isNaN(title.slice(0,2))) {
    return title.slice(2);
  } else if (!isNaN(title.slice(0,1))) {
    return title.slice(1);
  } else {
    return title;
  }
}
const modifyMsnbcArticleLink = (link) => {
  return link.charAt(0) === '/' ? `https://www.msnbc.com${link}` : link;
}

// CNN specific helper fns
const modifyCnnArticleLink = (link) => {
  return link.charAt(0) === '/' ? `https://www.cnn.com${link}` : link;
}

// Fox News specific helper fns
const modifyFoxNewsArticleLink = (link) => {
  return link.slice(0,2) === '//' ? link.slice(2) : link;
}

const getMsnbcArticles = (req, res) => {
  (async() => {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', true, function(requestData, networkRequest) {
      const match = requestData.url.match(/(.gif|.css|.jpg|.png|.svg|.woff|.ttf|.sjs|.js|jetpack|nvcdn)/g);
      if (match) {
        networkRequest.abort();
      } else {
        console.info('Requesting', requestData.url);
      };
    });
   
    const status = await page.open('https://msnbc.com/');
    const content = await page.property('content');
   
    await instance.exit();

    const $ = cheerio.load(content);
    let msnbcArticles = [];

    $('li.featured-slider-menu__item a').each((i, el) => {
      msnbcArticles.push({
        title: modifyMsnbcArticleTitle($(el).text()),
        link: modifyMsnbcArticleLink($(el).attr('href'))
      });
    });

    $('div.featured-slider__teaser h2.featured-slider__teaser__title a').each((i, el) => {
      msnbcArticles.push({
        title: $(el).text(),
        link: modifyMsnbcArticleLink($(el).attr('href'))
      });
    });

    res.json(msnbcArticles);
  })();
}

const getCnnArticles = (req, res) => {
  (async() => {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', true, function(requestData, networkRequest) {
      const match = requestData.url.match(/(.gif|.css|.jpg|.png|.svg|.woff|.ttf|.sjs|sharethrough|chartbeat|beemray|bounceexchange|ad.doubleclick|ads|krxd|outbrain|criteo.net|politics-static|facebook|bing|google|summerhamster|smetrics.cnn|gigya|tru.am|secure-us|optimizely|livefyre|usabilla|cookielaw|indexww|data:image)/g);
      if (match) {
        networkRequest.abort();
      } else {
        console.info('Requesting', requestData.url);
      };
    });
   
    const status = await page.open('https://cnn.com/');
    const content = await page.property('content');
   
    await instance.exit();

    const $ = cheerio.load(content);
    let cnnArticles = [];

    $('span.cd__headline-text').each((i, el) => {
      cnnArticles.push({
        title: $(el).text(),
        link: modifyCnnArticleLink($(el).parent().attr('href'))
      });
    });

    res.json(cnnArticles);
  })();
}

const getFoxNewsArticles = (req, res) => {
  (async() => {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', true, function(requestData, networkRequest) {
      const match = requestData.url.match(/(.gif|.css|.jpg|.png|.svg|.woff|.ttf|.sjs|.js)/g);
      if (match) {
        networkRequest.abort();
      } else {
        console.info('Requesting', requestData.url);
      };
    });
   
    const status = await page.open('https://foxnews.com/');
    const content = await page.property('content');
   
    await instance.exit();

    const $ = cheerio.load(content);
    let foxnewsArticles = [];

    $('article.article div.info header.info-header h2.title a').each((i, el) => {
      foxnewsArticles.push({
        title: $(el).text().trim(),
        link: modifyFoxNewsArticleLink($(el).attr('href'))
      });
    });

    res.json(foxnewsArticles);
  })();
}

module.exports = {
  getMsnbcArticles,
  getCnnArticles,
  getFoxNewsArticles
}
