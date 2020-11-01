var mysql = require("../loaders/mysql.js");
var Personality = {}

Personality.getAll = function() {
    return mysql.query(getQuery("allPersonalities"));
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allPersonalities":
            query = "SELECT * FROM personality;";
            break;
    }
    return query;
}

module.exports = Personality;