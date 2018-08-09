const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScrapeRecordSchema = new Schema({
  numMsnbcArticles: Number,
  numCnnArticles: Number,
  numFoxNewsArticles: Number,
  timeToScrape: Number,
  date:{ 
    type: Date,
    default: Date.now
  }
});

const ScrapeRecord = mongoose.model('ScrapeRecord', ScrapeRecord);

module.exports = ScrapeRecord;