const express = require("express");
var Services = require("../loaders/services.js");
var Database = require("../models/database.js");
const { createPool } = require("mysql");

// new router will handle all request to /
const router = express.Router();

// home page route
router.get("/", (req, res, next) => {
  Services.getHomePage()
  .then(function(data) {
    res.status(200).render("home", {
      css: ["home.css"],
      villager: {
        id: "vill",
        column_name: data.form_data1,
        table_name: "villager",
        title: {add: "Create Villager"},
        form_action: ["/" + req.params.table + "/create"]},
      island: {
        id: "isla",
        column_name: data.form_data2,
        table_name: "island",
        title: {add: "Create Island"},
        form_action: ["/" + req.params.table + "/create"]}, 
      personality: {
        id: "person",
        column_name: data.form_data3,
        table_name: "personality",
        title: {add: "Create Personality"},
        form_action: ["/" + req.params.table + "/create"],
        record: data.person_data},
      species: {
        id: "spec",
        column_name: data.form_data4,
        table_name: "species",
        title: {add: "Create Species"},
        form_action: ["/" + req.params.table + "/create"]}, 
      facility: {
        id: "fac",
        column_name: data.form_data5,
        table_name: "facility",
        title: {add: "Create Facility"},
        form_action: ["/" + req.params.table + "/create"]}
    })
  })
})

// search table route
router.get("/search/:table/:field/:value", (req, res, next) => {
  Services.getFormData(req.params.table, "name")
  .then(function(form_data) {
    Database.getAllFromTableByField(req.params.table, req.params.field, req.params.value)
    .then(function(result) {
      res.render("table_view", {
        css: ["table.css"],
        entity: {
          id: "add",
          table_name: req.params.table,
          record: result,
          column_name: form_data,
          title: {add: "Create " + req.params.table, update: "Update " + req.params.table}
        }
    })
  })
  })
  .catch(function(err) {
    next(err);
  })
})

// each table route
router.get("/:table/all", (req, res, next) => {
  Services.getFormData(req.params.table, "name")
  .then(function(form_data) {
    Database.getAllFromTable(req.params.table)
    .then(function(result) {
        res.render("table_view", {
        css: ["table.css"],
        entity: {
          id: "add",
          table_name: req.params.table,
          record: result,
          column_name: form_data,
          title: {add: "Create " + req.params.table, update: "Update " + req.params.table}
        }
        })
    })
  })
  .catch(function(err) {
    next(err);
  })
})

// create row for each table route
router.post("/:table/create", (req, res, next) => {
  page = req.body.page;
  delete req.body.page;
  if (req.body.compatibility) {
    compatibility = req.body.compatibility;
    delete req.body.compatibility;
    Database.addCompatibilities(compatibility);
  }
  Database.addByTable(req.params.table, req.body)
  .then(function() {
    if (page == "shop") {
      res.redirect("/shop");
    } else {
      res.redirect("/" + req.params.table + "/all");
    }
  })
})

// delete a row for each table route
router.post("/:table/delete", (req, res, next) => {
  Database.deleteFromTable(req.body.table, req.body.id)
  .then(function() {
    if (req.body.page == "shop") {
      res.redirect("/shop");
    } else if (req.body.page == "island") {
      res.redirect("/all_islands")
    } else {
      res.redirect("/" + req.params.table + "/all");
    }
  })
  .catch(function(err) {
    next(err);
  })
})

// update a row for each table route
router.put("/:table/update", (req, res, next) => {
  Database.updateByTable(req.params.table, req.body)
  .then(function() {
    res.redirect(303, "/" + req.params.table + "/all");
  })
  .catch(function(err) {
    next(err);
  })
})

// shop route
router.get("/shop", (req, res, next) => {
  island = 1; //change to user default island
  Services.getVillagerShop(island)
  .then(function(data) {
    // console.log(data);
    res.render("shop", {
      css: ["shop_villagers.css"],
      title: {future: "Future Neighbors!", current: "Current Neighbors!"},
      url: "/shop/island_change", 
      data});
  })
  .catch(function(err) {
    next(err);
  }) 
  
})

// shop facilities route
router.get("/shop_facilities", (req, res, next) => {
  island = 1; //change to user default island
  Services.getFacilityShop(island)
  .then(function(data) {
    //console.log(data);
    res.render("shop", {
      title: {future: "Future Facilities!", current: "Current Facilities!"},
      data_name: "facility",
      url: "/shop_facilities/island_change",
      data});
  })
  .catch(function(err) {
    next(err);
  }) 
  
})


// island page route
router.get("/all_islands", (req, res, next) => {
  Services.getIslands()
  .then(function(data) {
    res.render("island", {data});
  })
  .catch(function(err) {
    next(err);
  })
})

// search route
router.post("/search", (req, res, next) => {
  var b = req.body;
  res.redirect("/search/" + b.table + "/" + b.field + "/" + b.value);
})

// shop island_change page route
router.post("/shop/island_change", (req, res, next) => {
  Services.getVillagerShop(req.body.islandID)
  .then(function(data) {
    res.render("shop", {
    css: ["shop_villagers.css"],
    title: {future: "Future Neighbors!", current: "Current Neighbors!"},
    url: "/shop/island_change",  
    data});
  })
  .catch(function(err) {
    next(err);
  }) 
})

// shop facilities island_change
router.post("/shop_facilities/island_change", (req, res, next) => {
  Services.getFacilityShop(req.body.islandID)
  .then(function(data) {
    res.render("shop", {
      title: {future: "Future Facilities!", current: "Current Facilities!"},
      data_name: "facility",
      url: "/shop_facilities/island_change",
      data});
  })
  .catch(function(err) {
    next(err);
  }) 
})


module.exports = router;