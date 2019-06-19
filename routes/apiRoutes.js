let router = require("express").Router();
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Route for getting all Articles from the db
router.get("/api/articles/all", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({}).then(function(articles) {
    res.json(articles);
  });
});

router.get("/api/articles/unsaved", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({ saved: false }).then(function(articles) {
    res.json(articles);
  });
});

router.get("/api/articles/saved", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({ saved: true }).then(function(articles) {
    res.json(articles);
  });
});

// Route for grabbing a specific Article by id
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

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/api/notes/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findOne({ _id: req.params.id })
    .populate("notes")
    .then(function(notes) {
      console.log(notes);

      res.json(notes);
    })
    .catch(err => {
      console.log(err);
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
router.post("/api/notes/", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  console.log(req.body);
  db.Note.create({ body: req.body.noteText })
    .then(dbNote => {
      return db.Article.findOneAndUpdate(
        { _id: req.body._headlineId },
        { $push: { notes: dbNote._id } },
        { new: true }
      );
    })
    .then(article => {
      res.json(article);
    });
});

router.put("/api/articles/save/:id", function(req, res) {
  db.Article.updateOne({ _id: req.params.id }, { saved: true })
    .then(result => {
      console.log("save successful!");
      console.log(result);
      res.json(result);
    })
    .catch(err => {
      console.log("save failed :(");
      console.log(err);
      res.json({ err });
    });
});

router.put("/api/articles/unsave/:id", function(req, res) {
  db.Article.updateOne({ _id: req.params.id }, { saved: false })
    .then(result => {
      console.log("unsave successful!");
      console.log(result);
      res.json(result);
    })
    .catch(err => {
      console.log("unsave failed :(");
      console.log(err);
      res.json({ err });
    });
});

router.delete("/api/articles/", function(req, res) {
  db.Article.deleteMany({})
    .then(result => {
      console.log(result);
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.json(err);
    });
});

module.exports = router;
