const express = require("express");
var Species = require("../models/species.js");
var Personality = require("../models/personality.js");
var Island = require("../models/island.js");
var Facility = require("../models/facility.js");
var Villager = require("../models/villager.js");

// new router will handle all request to /
const router = express.Router();

// home page route
router.get("/", (req, res, next) => {
  res.status(200).render("home", {
    css: ["home.css"]
  });
});

router.get("/villager", (req, res, next) => {
  Villager.getAll()
  .then(function(result) {
    res.render("villager", {
      css: ["table.css", "table-page.css"],
      column_name: ["villagerID", "name", "birthday", "hobby", "species", "personality", "island"],
      record: result
    })
  })
  .catch(function(err) {
    next(err);
  })
});

router.get("/personality", (req, res, next) => {
    Personality.getAll()
    .then(function(result) {
      res.render("personality", {
        css: ["table.css", "table-page.css"],
        column_name: ["personalityID", "type", "description", "wakeTime", "sleepTime", "activities", "compatible"],
        record: result,
      })
    })
    .catch(function(err) {
      next(err);
    })
});

router.get("/species", (req, res, next) => {
    Species.getAll()
    .then(function(result) {
      res.render("species", {
        css: ["table.css", "table-page.css"],
        column_name: ["speciesID", "type"],
        record: result
      })
    })
    .catch(function(err) {
      next(err);
    });
});

router.get("/island", (req, res, next) => {
  Island.getAll()
  .then(function(result) {
    res.render("island", {
      css: ["table.css", "table-page.css"],
      column_name: ["islandID", "name"],
      title: {add: "Create An Island", update: "Update Island"}, 
      text_input: ["Island Name"],
      drop_down_input: ["Add a Villager", "Add A Facility"],
      form_action: ["/island"],
      record: result
    })
  })
  .catch(function(err) {
    next(err);
  });
});

router.get("/facility", (req, res, next) => {
  Facility.getAll()
  .then(function(result) {
    res.render("facility", {
      css: ["table.css", "table-page.css"],
      column_name: ["facilityID", "name"],
      title: {add: "Create A Facility", update: "Update Facility"}, 
      text_input: ["Facility Name"],
      form_action: ["/facility"],
      record: result, 
    })
  })
  .catch(function(err) {
    next(err);
  });
});

module.exports = router;