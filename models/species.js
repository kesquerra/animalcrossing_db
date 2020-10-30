var mysql = require("../loaders/mysql.js");
var Species = {}

Species.getAllSpecies = function() {
    return mysql.query(getQuery("allSpecies"));
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allSpecies":
            query = "SELECT * FROM species;";
            break;
    }
    return query;
}

module.exports = Species;