// Module imports
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./loaders/mysql.js")
const hb = require("./loaders/helpers.js")

// router imports
const indexRouter = require("./routes/indexRouter");
const { resolve } = require("path");

// create new instance of express app and set port
const app = express();
const port = process.env.PORT || 3000;
app.set("port", port);

// set body parser setting
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//use handlebars as templating engine
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      ifCond: hb.registerHelper
    }
  })
);
app.set("view engine", "handlebars");

// look for all static files in the "static" directory
app.use(express.static(path.join(__dirname, "static")));

// logging function and set app to use the logger
function logger(req, res, next) {
  console.log("Request:", "--Method:", req.method, "--URL:", req.url);
  next();
}
app.use(logger);

/*
    App Routing -  connect routers the app
*/
app.use("/", indexRouter);

db.connection()
.then(function() {
    console.log("Database connection established..");
    resolve();
})
.catch(function(err) {console.log(err)})


// set function to respond to any unhandled GET request
app.get("*", (req, res, next) => {
  res.status(404).send("404 - Not Found.");
});

// set function to handle other errors that occur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500)
  res.render("error", {errorMessage: err})
});

// set app to listen for requests at port
app.listen(port, () => {
  console.log(
    `App listening at port: ${app.get("port")}; press Ctrl-C to terminate.`
  );
});