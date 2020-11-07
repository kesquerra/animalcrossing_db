var mysql = require("../loaders/mysql.js");
var Database = {}

Database.getAllFromTable = function(table) {
    return mysql.query(getQuery("allFromTable"), [table]);
}

Database.getAllFromTableByField = function(table, field, value) {
    return mysql.query(getQuery("allFromTableByField"), [table, field, '%' + value + '%']);
}

Database.getAllFieldNames = function(table) {
    return mysql.query(getQuery("allFieldNames"), [table]);
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allFromTable":
            query = "SELECT * FROM ??;";
            break;
        case "allFromTableByField":
            query = "SELECT * FROM ?? WHERE ?? LIKE ?;";
            break;
        case "allFieldNames":
            query = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?;";
            break;
    }
    return query;
}

module.exports = Database;