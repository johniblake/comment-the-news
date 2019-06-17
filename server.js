var express = require("express");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// Routes
app.use(require("./routes/htmlRoutes"));
app.use(require("./routes/apiRoutes"));

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
