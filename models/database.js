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
    console.log(data)
    var keys = [];
    var query_values = [];
    var sql;
    data.forEach(function(key) {
        keys.push(key);
        query_values.push(record[key].toString());
    })
    keys = keys.slice(1, )
    query_values = query_values.slice(1, )
    sql = "INSERT INTO ?? (??) VALUES (?)";
    var query = {sql: sql, table: table, columns: keys, values: query_values}
    var inserts = [query.table, query.columns, query.values];
    return mysql.query(sql, inserts)
}

Database.deleteFromTable = function(table, id) {
    field = table + "ID";
    return mysql.query(getQuery("deleteByID"), [table, field, id])
}

Database.addCompatibilities = function(compatibility) {
    Database.getMaxPersonalityID()
    .then(function(maxID) {
        var id1 = maxID[0].personalityID + 1;
        for (id2 of compatibility) {
            mysql.query(getQuery("addCompatibility"), [id1, id2]);
        }
        return
    })
};

Database.updateByTable = function(table, record) {
    data = Object.keys(record)
    var inserts = [table];
    var values = [];
    var composite = false;
    var sql; 

    data.forEach(function(key) {
        values.push(record[key]);
    })
    var row_id = parseInt(values.shift());
    var id_column = data.shift();

    if (table == "island_villager" || table == "island_facility" || table == "compatibility") {
        for (var y = 0; y < values.length; y++) {
            x = parseInt(values[y])
            values[y] = x
        }
        inserts = insertsOrder(inserts, data, values)
        sql = sqlUpdateString(data, composite)
    } else {
        sql = sqlUpdateString(values, composite)
        inserts = insertsOrder(inserts, data, values, composite)
    }
    inserts.push(id_column)
    inserts.push(row_id);
    return mysql.query(sql, inserts)
}

function insertsOrder(inserts, data, values) {
    for (var y = 0; y < data.length; y++) {
        inserts.push(data[y]);
        inserts.push(values[y]);
    }
    return inserts
}

function sqlUpdateString(data, composite) {
    var sql = "UPDATE ?? SET ";
    var updateString = "?? = ?"
    for (var i = 0; i < data.length; i++) {
        if (i == data.length - 1) {
            sql += updateString;
        } else {
            sql += updateString + ", ";
        }
    }
    sql += " WHERE "
    if (!composite) {
        sql += updateString + ";"; 
    } else {
        for (var x = 0; x < data.length; x++) {
            if (x == data.length - 1) {
                sql += updateString
            } else {
                sql += updateString + " AND "
            }
        }
    }
    return sql
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
                    TIME_FORMAT(personality.sleepTime, '%h:%i %p') AS sleepTime, personality.activities AS activites, \
                    island_villager.island_villagerID as id \
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
            query = "INSERT INTO compatibility (p1, p2) VALUES (?, ?)";
            break;
        case "deleteByID":
            query = "DELETE FROM ?? WHERE ?? = ?";
            break;
    }
    return query;
}

module.exports = Database;