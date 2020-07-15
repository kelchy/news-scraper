# News Scraper

*Scrape news articles from MSNBC, CNN, and Fox News for future reference*

[Demo](#demo) <br>
[About](#about)<br>
[Technologies](#technologies)

## Demo

* [deployed link](https://news-scraper-551.herokuapp.com)
* Articles are automatically scraped from the three news sites. Users can filter articles by source and/or category.
  
  ![scrape_and_filter](public/images/scrape_and_filter.gif)

* Articles can be saved for future reference by clicking the save button. These articles will be visible in the saved tab. Each saved article allows for comments to be added and deleted, and can itself also be deleted. 

  ![articles_comments](public/images/articles_comments.gif)

## About

### Scraping

* Article titles and links are scraped from three news websites (MSNBC, CNN, and Fox News) using [Phantom](https://www.npmjs.com/package/phantom) and [Cheerio](https://www.npmjs.com/package/cheerio).
* The category for scraped articles is determined from its associated link.
* The scraping operation takes several seconds to complete, primarily because CNN's website uses javascript rendering and thus requires phantom to load the javascript files before the scraper can continue.

### Data

* This app uses a MongoDB for storing data. Scraped articles can be saved for future reference, and each saved article allows for comments. 
* A record of every scrape is also saved to the database and can be used to assess whether the three news sites have changed, such that the scraper needs to be updated.

### API Endpoints

|Method|Endpoint                              |Functionality                             |
|------|--------------------------------------|------------------------------------------|
|GET   |/api/scrape                           |get results of scrape operation           |
|GET   |/api/articles                         |get all saved articles                    |
|POST  |/api/articles                         |save a scraped article                    |
|GET   |/api/articles/:id                     |get a saved article and its comments      |
|DELETE|/api/articles/:id                     |deletes article and its comments          |
|POST  |/api/articles/:article_id/comments    |creates a new comment for an article      |
|DELETE|/api/articles/:article_id/comments/:id|deletes comment associated with an article|
|GET   |/api/scraperecords                    |gets last 10 scrape records               | 

## Technologies

* MongoDB, Mongoose, Node.js, Express, Handlebars.js, JavaScript, jQuery, Materialize
#
