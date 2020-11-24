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
    comp_tables = ["compatibility", "island_facility", "island_villager"]
    if (comp_tables.includes(table)) {
        field_id = table + "." + field
        if (table == "compatibility") {
            new_table = "personality"
            table_field = new_table + ".personalityID"
        } else {
            new_table = field.substring(0, field.length - 2)
            table_field = new_table + "." + field
        }
        label = new_table + "." + field_label
        field = new_table //island
        return mysql.query(getQuery("uniqueFromTable"), [table_field, label, table, field]);
    } else {
        var table_field = table + "." + field;
        var label = field + "." + field_label;
        var field_id = field + "." + field + "ID";
        return mysql.query(getQuery("uniqueFromTableByField"), [table_field, label, table, field, table_field, field_id]);
    }
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

Database.getFacilitiesNotOnIslandID = function(islandID) {
    return mysql.query(getQuery("allFacilitiesNotOnIslandID"), [islandID]);
}

Database.getMaxPersonalityID = function() {
    return mysql.query(getQuery("maxID"));
}

Database.addCompatibility = function(p1, p2) {
    return mysql.query(getQeury("addCompatibility") [p1, p2]);
}

Database.addByTable = function(table, record) {
    data = Object.keys(record)
    var keys = [];
    var query_values = [];
    var sql;
    data.forEach(function(key) {
        keys.push(key);
        query_values.push(record[key]);
    })
    if (table == "villager") {
        sql = "INSERT INTO " + table + " (" + keys + ") VALUES (?, ?, ?, ?, ?, ?)";
    } else if (table == "personality") {
        sql = "INSERT INTO " + table + " (" + keys + ") VALUES (?, ?, ?, ?, ?)";
    } else if (table == "island" || table == "species") {
        sql = "INSERT INTO " + table + " (" + keys + ") VALUES (?)";
    } else {
        sql = "INSERT INTO " + table + " (" + keys + ") VALUES (?, ?)";
    }
    var query = {sql: sql, values: query_values}
    return query
}

Database.addCompatibilities = function(compatibility) {
    Database.getMaxPersonalityID()
    .then(function(maxID) {
        var id1 = maxID[0].personalityID + 1;
        for (id2 of compatibility) {
            return mysql.query("INSERT INTO compatibility (p1, p2) VALUES (" + id1 + ", " + id2 + ")");
        }
    })
};

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
        case "uniqueFromTable":
            query = "SELECT DISTINCT ??, ?? FROM ?? JOIN ??";
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
                    personality.description AS description, TIME_FORMAT(personality.wakeTime, '%h:%i %p') AS wakeTime, \
                    TIME_FORMAT(personality.sleepTime, '%h:%i %p') AS sleepTime, personality.activities AS activites \
                    FROM villager \
                    JOIN species ON villager.species = species.speciesID \
                    JOIN personality ON villager.personality = personality.personalityID \
                    JOIN island_villager ON villager.villagerID = island_villager.villagerID AND island_villager.islandID = ?\
                    ORDER BY villager.name ASC;";
            break;
        case "allVillagersNotOnIslandID":
            query = "SELECT villager.name, villager.villagerID, DATE_FORMAT(villager.birthday,'%M %d') AS birthday, \
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
            query = "SELECT facility.name, island_facility.islandID as islandID FROM facility \
                    JOIN island_facility on island_facility.facilityID = facility.facilityID AND island_facility.islandID = ? \
                    ORDER BY facility.name ASC;"
            break;
        case "allFacilitiesNotOnIslandID":
            query = "SELECT facility.name, facility.facilityID FROM facility WHERE facility.facilityID NOT IN \
                    (SELECT facility.facilityID FROM facility \
                        JOIN island_facility ON facility.facilityID = island_facility.facilityID AND island_facility.islandID = ?) \
                    ORDER BY facility.name ASC;"
            break;
        case "allIslands":
            query = "SELECT island.islandID, island.name FROM island \
                    ORDER BY island.islandID ASC;"
            break;
        case "maxID":
            query = "SELECT personalityID FROM personality WHERE personalityID=(SELECT max(personalityID) FROM personality);"
            break;
        case "addCompatibility":
            query = "INSERT INTO compatibility (p1, p2) VALUES (?, ?);"
    }
    return query;
}

module.exports = Database;