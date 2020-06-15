const puppeteer = require('puppeteer');
const mongoose  = require('mongoose');
const db        = require('../models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news-scraper';
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
var lim = 100;
var count = 0;

function find() {
    db.Article.find({},{link:1}).sort({_id:-1}).limit(lim).catch(e=>console.error(e)).then(res=>iterate(res));
}

find();

async function iterate(list) {
    for (o of list) {
        /*
        var docs = await db.Tweet.countDocuments({articles: o._id}).catch(e=>console.error(e));
        console.log(o._id, docs);
        if (docs > 0) {
            upsert();
            continue;
        }
        */
        await upsert(o.link, o._id);
    }
}

async function upsert(link, id) {
    count++;
    if (link && id) {
        var list = await fetch(link).catch(e=>console.error(e));
        for (p of list) {
            p = p.toLowerCase();
            console.log(id, p, `${count} / ${lim}`);
            await db.Tweet.update({ handle: p }, { '$addToSet': { articles: id } }, { upsert: true }).catch(e=>console.error(e));
        }
    }
    if (count >= lim) {
        count = 0;
        setTimeout(()=>{find()}, 24 * 60 * 60 * 1000);
    }
    else return;
}

async function fetch(ref) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `https://twitter.com/search?q=${encodeURI(ref)}&src=typed_query`;
    await page.goto(url, {waitUntil: 'networkidle2'});
    await page.setViewport({
        width: 1200,
        height: 800
    });
    await autoScroll(page);
    // we don't need to do a screenshot everytime
    // await page.pdf({path: 'page.pdf', format: 'A4'});
    var list = await page.evaluate(() => {
        let elements = Array.from(document.querySelectorAll('span.css-901oao.css-16my406.r-1qd0xha.r-ad9z0x.r-bcqeeo.r-qvutc0'));
        let mapped = elements.map(o => { return o.innerHTML });
        return mapped.filter(o => { return o[0] == '@' ? o : undefined });
    });

    await browser.close();
    return list;
}

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

