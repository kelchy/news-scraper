//===== Dependencies
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

//===== Database/Models
const db = require('./models');

//===== App
const app = express();
const PORT = process.env.PORT || 3000;

//===== Load Routes
const main = require('./routes/main');

//===== Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + './public'));

//===== Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


//===== Use Routes
app.use('/', main);

//===== Listen
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});