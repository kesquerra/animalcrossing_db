const express = require("express");
var Species = require("../models/species.js");
var Personality = require("../models/personality.js");
var Island = require("../models/island.js");
var Facility = require("../models/facility.js");
var Villager = require("../models/villager.js");
var Database = require("../models/database.js");

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
      title: {add: "Create A Villager", update: "Update Villager"}, 
      text_input: ["Villager Name"],
      date_input: ["Birthday"],
      drop_down_input: ["Hobby", "Species", "Personality"],
      form_action: ["/villager"],
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
        title: {add: "Create A Personality", update: "Update Personality"}, 
        text_input: ["Description"],
        drop_down_input: ["Type", "Activity"],
        date_input: ["Wake Time", "Sleep Time"],
        box_input: ["Compatible With"],
        form_action: ["/personality"],
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
        title: {add: "Create A Species", update: "Update Species"}, 
        text_input: ["Species Name"],
        form_action: ["/species"],
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

router.get("/:table/:field/:value", (req, res, next) => {
  Database.getAllFieldNames(req.params.table)
  .then(function(column_name) {
    Database.getAllFromTableByField(req.params.table, req.params.field, req.params.value)
    .then(function(result) {
      res.render(req.params.table, {
      css: ["table.css", "table-page.css"],
      record: result,
      column_name,
      title: {add: "Create A Villager", update: "Update Villager"}, 
      text_input: ["Villager Name"],
      date_input: ["Birthday"],
      drop_down_input: ["Hobby", "Species", "Personality"],
      form_action: ["/villager"]
    })
  })
  })
})

router.get("/:table/all", (req, res, next) => {
  Database.getAllFieldNames(req.params.table)
  .then(function(column_name) {
    Database.getAllFromTable(req.params.table)
    .then(function(result) {
      res.render(req.params.table, {
      css: ["table.css"],
      record: result,
      column_name,
      title: {add: "Create A Villager", update: "Update Villager"}, 
      text_input: ["Villager Name"],
      date_input: ["Birthday"],
      drop_down_input: ["Hobby", "Species", "Personality"],
      form_action: ["/villager"]
    })
  })
  })
})


module.exports = router;