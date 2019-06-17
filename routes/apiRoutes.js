let router = require("express").Router();
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Route for getting all Articles from the db
router.get("/api/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({}).then(function(articles) {
    res.json(articles);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/api/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findOne({ _id: req.params.id }).then(function(article) {
    res.json(article);
  });
});

// Route for saving/updating an Article's associated Note
router.post("/api/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(dbNote => {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { notes: dbNote._id } },
        { new: true }
      );
    })
    .then(article => {
      res.json(article);
    });
});

module.exports = router;
