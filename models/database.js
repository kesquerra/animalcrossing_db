var mysql = require("../loaders/mysql.js");
var Database = {}

Database.getAllFromTable = function(table) {
    return mysql.query(getQuery("allFromTable"), [table]);
}

Database.getAllFromTableByField = function(table, field, value) {
    return mysql.query(getQuery("allFromTableByField"), [table, field, value]);
}

Database.getAllFieldNames = function(table) {
    return mysql.query(getQuery("allFieldNames"), [table]);
}

Database.getUniqueFromTableByField = function(table, field, field_label) {
    var table_field = table + "." + field;
    var label = field + "." + field_label;
    var field_id = field + "." + field + "ID";
    return mysql.query(getQuery("uniqueFromTableByField"), [table_field, label, table, field, table_field, field_id]);
}

Database.getAllVillagers = function() {
    return mysql.query(getQuery("allVillagers"));
}

Database.getAllIslands = function() {
    return mysql.query(getQuery("allIslands"));
}

Database.getAllVillagersByIslandID = function (islandID) {
    return mysql.query(getQuery("allVillagersByIslandID"), [islandID]);
}

Database.getVillagersNotOnIslandID = function(islandID) {
    return mysql.query(getQuery("allVillagersNotOnIslandID"), [islandID]);
}

Database.getAllFacilitiesByIslandID = function(islandID) {
    return mysql.query(getQuery("allFacilitiesByIslandID"), [islandID]);
}




function getQuery(type) {
    var query = "";
    switch(type) {
        case "allFromTable":
            query = "SELECT * FROM ??;";
            break;
        case "allFromTableByField":
            query = "SELECT * FROM ?? WHERE ?? = ?;";
            break;
        case "allFieldNames":
            query = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?;";
            break;
        case "uniqueFromTableByField":
            query = "SELECT DISTINCT ??, ?? FROM ?? JOIN ?? ON ?? = ??";
            break;
        case "allVillagers":
            query = "SELECT villager.name as name, DATE_FORMAT(villager.birthday,'%M %d') AS birthday, island_villager.islandID as islandID, \
                    villager.hobby as hobby, species.name AS species, personality.name AS personality, villager.image_url AS image_url, \
                    personality.description, TIME_FORMAT(personality.wakeTime, '%h:%i %p') AS wakeTime, TIME_FORMAT(personality.sleepTime, '%h:%i %p') AS sleepTime, personality.activities \
                    FROM villager \
                    JOIN species ON villager.species = species.speciesID \
                    JOIN personality ON villager.personality = personality.personalityID \
                    LEFT JOIN island_villager ON villager.villagerID = island_villager.villagerID \
                    ORDER BY villager.name ASC;";
            break;
        case "allVillagersByIslandID":
            query = "SELECT villager.name as name, DATE_FORMAT(villager.birthday,'%M %d') AS birthday, island_villager.islandID as islandID, \
                    villager.hobby, species.name AS species, personality.name AS personality, villager.image_url AS image_url, \
                    personality.description, TIME_FORMAT(personality.wakeTime, '%h:%i %p') AS wakeTime, TIME_FORMAT(personality.sleepTime, '%h:%i %p') AS sleepTime, personality.activities \
                    FROM villager \
                    JOIN species ON villager.species = species.speciesID \
                    JOIN personality ON villager.personality = personality.personalityID \
                    JOIN island_villager ON villager.villagerID = island_villager.villagerID AND island_villager.islandID = ?\
                    ORDER BY villager.name ASC;";
            break;
        case "allVillagersNotOnIslandID":
            query = "SELECT villager.name, DATE_FORMAT(villager.birthday,'%M %d') AS birthday, \
                    villager.hobby, species.name AS species, personality.name AS personality, villager.image_url AS image_url, \
                    personality.description, TIME_FORMAT(personality.wakeTime, '%h:%i %p') AS wakeTime, TIME_FORMAT(personality.sleepTime, '%h:%i %p') AS sleepTime, personality.activities \
                    FROM villager \
                    JOIN species ON villager.species = species.speciesID AND villager.villagerID NOT IN \
                    (SELECT villager.villagerID \
                    FROM villager \
                    JOIN island_villager ON villager.villagerID = island_villager.villagerID AND island_villager.islandID = ?) \
                    JOIN personality ON villager.personality = personality.personalityID \
                    ORDER BY villager.name ASC;"
            break;
        case "allFacilitiesByIslandID":
            query = "SELECT facility.name as name FROM facility \
                    LEFT JOIN island_facility on island_facility.facilityID = facility.facilityID AND island_facility.islandID = ? \
                    ORDER BY facility.name ASC;"
            break;
        case "allIslands":
            query = "SELECT island.islandID, island.name FROM island \
                    ORDER BY island.islandID ASC;"
    }
    return query;
}

module.exports = Database;