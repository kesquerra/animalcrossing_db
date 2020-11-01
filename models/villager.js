var mysql = require("../loaders/mysql.js");
var Villager = {}

Villager.getAll = function() {
    return mysql.query(getQuery("allVillagers"));
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allVillagers":
            query = "SELECT * FROM villager;";
            break;
    }
    return query;
}

module.exports = Villager;