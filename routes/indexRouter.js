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
      css: ["table.css"]
    });
});

router.get("/personality", (req, res, next) => {
    res.status(200).render("personality", {
      css: ["table.css"]
    });
});

router.get("/species", (req, res, next) => {
    res.status(200).render("species", {
      css: ["table.css"]
    });
});

router.get("/island", (req, res, next) => {
    res.status(200).render("island", {
      css: ["table.css"]
    });
});

router.get("/facility", (req, res, next) => {
    res.status(200).render("facility", {
      css: ["table.css"]
    });
  });

module.exports = router;