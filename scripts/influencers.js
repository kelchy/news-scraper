const mongoose    = require('mongoose');
const db          = require('../models');
const democrats   = require('./democrats');
const republicans = require('./republicans');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news-scraper';
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

async function inf() {
    for (dem of democrats.list) {
        console.log({ handler: dem },{ '$set': { tag:'democrat', score: 5} })
    }
    for (gop of republicans.list) {
        console.log({ handler: gop },{ '$set': { tag:'republican', score: 5} })
    }
}

inf();
