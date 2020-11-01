var mysql = require("../loaders/mysql.js");
var Island = {}

Island.getAll = function() {
    return mysql.query(getQuery("allIslands"));
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allIslands":
            query = "SELECT * FROM island;";
            break;
    }
    return query;
}

module.exports = Island;