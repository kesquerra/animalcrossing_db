var mysql = require("../loaders/mysql.js");
var Facility = {}

Facility.getAll = function() {
    return mysql.query(getQuery("allFacilities"));
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allFacilities":
            query = "SELECT * FROM facility;";
            break;
    }
    return query;
}

module.exports = Facility;