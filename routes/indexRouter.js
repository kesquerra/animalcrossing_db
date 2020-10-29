const express = require("express");

// new router will handle all request to /
const router = express.Router();

// home page route
router.get("/", (req, res, next) => {
  res.status(200).render("home", {
    css: ["home.css"]
  });
});

router.get("/villager", (req, res, next) => {
    res.status(200).render("villager", {
      css: ["table.css"],
      column_name: ["villagerID", "name", "birthday", "hobby", "species", "personality", "island"]
      //record: sql.getQuery() //populate with SQL query
    });
});

router.get("/personality", (req, res, next) => {
    res.status(200).render("personality", {
      css: ["table.css"],
      column_name: ["personalityID", "type", "description", "wakeTime", "sleepTime", "activities", "compatible"]
      //record: sql.getQuery() //populate with SQL quer
    });
});

router.get("/species", (req, res, next) => {
    res.status(200).render("species", {
      css: ["table.css"],
      column_name: ["speciesID", "type"]
    });
});

router.get("/island", (req, res, next) => {
    res.status(200).render("island", {
      css: ["table.css"],
      column_name: ["islandID", "name"]
    });
});

router.get("/facility", (req, res, next) => {
    res.status(200).render("facility", {
      css: ["table.css"],
      column_name: ["facilityID", "name"]
    });
  });

module.exports = router;