const mongoose    = require('mongoose');
const db          = require('../models');
const democrats   = require('./democrats');
const republicans = require('./republicans');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news-scraper';
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

async function inf() {
    for (dem of democrats.list) {
        await db.Tweet.update({ handle: dem },{ '$set': { tag:'democrat', score: 5} }).catch(e=>console.error(e))
    }
    for (gop of republicans.list) {
        await db.Tweet.update({ handle: gop },{ '$set': { tag:'republican', score: 5} }).catch(e=>console.error(e))
    }
    return;
}

inf().then(()=>process.exit(0));
