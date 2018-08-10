//===== Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

//===== App
const app = express();
const PORT = process.env.PORT || 3000;

//===== Load Routes
const index = require('./routes/index');
const scraper = require('./routes/scraper');

//===== Database Config
mongoose.connect('mongodb://localhost:27017/news-scraper', { useNewUrlParser: true });

//===== Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

//===== Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//===== Use Routes
app.use('/', index);
app.use('/api', scraper);

//===== Listen
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});