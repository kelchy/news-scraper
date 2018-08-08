const phantom = require('phantom');
const cheerio = require('cheerio');

const updateCnnArticleLink = (link) => {
  if (link.charAt(0) === '/') {
    return `https://www.cnn.com${link}`;
  } else {
    return link;
  }
}

const getCnnPage = (req, res) => {
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
        link: updateCnnArticleLink($(el).parent().attr('href'))
      });
    });

    res.json(cnnArticles);
  })();
}

module.exports = {
  getCnnPage
}

 