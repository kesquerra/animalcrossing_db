const express = require("express");
var Services = require("../loaders/services.js");
var Database = require("../models/database.js");
const { createPool } = require("mysql");

// new router will handle all request to /
const router = express.Router();

// home page route
router.get("/", (req, res, next) => {
  res.status(200).render("home", {
    css: ["home.css"]
  });
});

router.get("/search/:table/:field/:value", (req, res, next) => {
  Database.getAllFieldNames(req.params.table)
  .then(function(column_name) {
    Database.getAllFromTableByField(req.params.table, req.params.field, req.params.value)
    .then(function(result) {
      res.render(req.params.table, {
        css: ["table.css"],
        table_name: req.params.table,
        record: result,
        column_name,
        title: {add: "Create A " + req.params.table, update: "Update " + req.params.table}, 
        form_action: ["/" + req.params.table + "/create"]
    })
  })
  })
  .catch(function(err) {
    next(err);
  })
})

router.get("/:table/all", (req, res, next) => {
  Services.getFormData(req.params.table)
  .then(function(form_data) {
    Database.getAllFromTable(req.params.table)
    .then(function(result) {
        res.render(req.params.table, {
        css: ["table.css"],
        table_name: req.params.table,
        record: result,
        column_name: form_data,
        title: {add: "Create A " + req.params.table, update: "Update " + req.params.table}, 
        form_action: ["/" + req.params.table + "/create"]
        })
    })
  })
  .catch(function(err) {
    next(err);
  })
})

router.post("/search", (req, res, next) => {
  var b = req.body;
  res.redirect("/search/" + b.table + "/" + b.field + "/" + b.value);
})


module.exports = router;