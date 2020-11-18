const express = require("express");
var Services = require("../loaders/services.js");
var Database = require("../models/database.js");
const { createPool } = require("mysql");

// new router will handle all request to /
const router = express.Router();

// home page route
router.get("/", (req, res, next) => {
  Services.getFormData("villager", "name")
  .then(function(form_data) {
    Services.getFormData("island", "name")
    .then(function(form_data2) {
      Services.getFormData("personality", "name")
      .then(function(form_data3) {
        Services.getFormData("species", "name")
        .then(function(form_data4) {
          Services.getFormData("facility", "home")
          .then(function(form_data5) {
            Database.getAllFromTable("personality")
            .then(function(person_data) {
              res.status(200).render("home", {
                css: ["home.css"],
                villager: {
                  id: "vill",
                  column_name: form_data,
                  title: {add: "Create A Villager"},
                  form_action: ["/" + req.params.table + "/create"]},
                island: {
                  id: "isla",
                  column_name: form_data2,
                  title: {add: "Create An Island"},
                  form_action: ["/" + req.params.table + "/create"]}, 
                personality: {
                  id: "person",
                  column_name: form_data3,
                  table_name: "personality",
                  title: {add: "Create A Personality"},
                  form_action: ["/" + req.params.table + "/create"],
                  record: person_data},
                species: {
                  id: "spec",
                  column_name: form_data4,
                  title: {add: "Create A Species"},
                  form_action: ["/" + req.params.table + "/create"]}, 
                facility: {
                  id: "fac",
                  column_name: form_data5,
                  title: {add: "Create A Facility"},
                  form_action: ["/" + req.params.table + "/create"]}
              })
            })
          })
        })
      }) 
    })
  })
})

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

router.post("/:table/create", (req, res, next) => {
  Database.addByTable(req.params.table, req.body)
  .then(function() {
    res.redirect("/" + req.params.table + "/all");
  })
})

router.get("/shop", (req, res, next) => {
  island = 1; //change to user default island
  Services.getVillagerShop(island)
  .then(function(data) {
    //console.log(data);
    res.render("shop", {
      title: {future: "Future Neighbors!", current: "Current Neighbors!"},
      url: "/shop/island_change", 
      data});
  })
  .catch(function(err) {
    next(err);
  }) 
  
})

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

router.get("/all_islands", (req, res, next) => {
  Services.getIslands()
  .then(function(data) {
    res.render("island", {data});
  })
  .catch(function(err) {
    next(err);
  })
})

router.post("/search", (req, res, next) => {
  var b = req.body;
  res.redirect("/search/" + b.table + "/" + b.field + "/" + b.value);
})

router.post("/shop/island_change", (req, res, next) => {
  Services.getVillagerShop(req.body.islandID)
  .then(function(data) {
    res.render("shop", {
    title: {future: "Future Neighbors!", current: "Current Neighbors!"},
    url: "/shop/island_change",  
    data});
  })
  .catch(function(err) {
    next(err);
  }) 
})

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