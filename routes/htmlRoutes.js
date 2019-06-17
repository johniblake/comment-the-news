let router = require("express").Router();
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// A GET route for scraping the echoJS website
router.get("/", function(req, res) {
  // First, we grab the body of the html with axios
  axios
    .get("http://www.echojs.com/")
    .then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        // Create a new Article using the `result` object built from scraping
        db.Article.find({ title: result.title })
          .then(article => {
            console.log(article);
            //if the scraped article is not in the database, create a new record in the database
            if (!article) {
              db.Article.create(result)
                .then(function(dbArticle) {
                  // View the added result in the console
                  console.log(dbArticle);
                })
                .catch(err => {
                  // If an error occurred, log it
                  console.log(err);
                });
            }
          })
          .catch(err => {
            res.json(err);
          });
      });
      // Send a message to the client
      return true;
    })
    .then(() => {
      db.Article.find().then(articles => {
        console.log("Articles:");

        console.log(articles);

        res.render("index", { Articles: articles });
      });
    });
});

module.exports = router;
