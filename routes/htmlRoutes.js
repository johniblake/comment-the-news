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
    .get("http://www.startribune.com/local/")
    .then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      $(".tease").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .find(".tease-headline")
          .text()
          .trim();

        result.link = $(this)
          .find(".tease-headline")
          .attr("href")
          .trim();

        result.summary = $(this)
          .find(".tease-summary")
          .text()
          .trim();

        console.log("RESULT: ");
        console.log(result);

        // Create a new Article using the `result` object built from scraping
        // let article = db.Article.create(result).then();
        db.Article.updateOne({ title: result.title }, result, {
          upsert: true,
          setDefaultsOnInsert: true
        })
          .then(article => {
            console.log("Successfully updated/added item to db!");
            console.log(article);
          })
          .catch(err => {
            res.json(err);
          });
      });
      // Send a message to the client
      return true;
    })
    .then(() => {
      db.Article.find({ saved: false }).then(articles => {
        //console.log("Articles:");

        //console.log(articles);

        res.render("index", { Articles: articles });
      });
    });
});

router.get("/saved", (req, res) => {
  db.Article.find({ saved: true }).then(articles => {
    //console.log("Articles:");

    //console.log(articles);

    res.render("saved", { Articles: articles });
  });
});

module.exports = router;
