const express = require("express");

// new router will handle all request to /
const router = express.Router();

// home page route
router.get("/", (req, res, next) => {
  res.status(200).render("home", {
      css: ["home.css"]
  });
});

module.exports = router;