var Services = {};
const { getAllVillagersByIslandID } = require("../models/database.js");
var Database = require("../models/database.js");

// Retrieve data from submitted form 
Services.getFormData = function(table, field_label) {
    return new Promise(function(resolve, reject) {
        Database.getAllFieldNames(table)
        .then(function(result) {
            var form_data = [];
            result.forEach(async (col) => {
                if (col.COLUMN_KEY == 'MUL') {
                    const uniques = await Database.getUniqueFromTableByField(table, col.COLUMN_NAME, field_label);
                    var unique_vals = [];
                    uniques.forEach((val) => {
                        col_name = col.COLUMN_NAME;
                        if (table == "compatibility") {
                            col_name = "personalityID";
                        }
                        if (val[col_name] != 'null') {
                            unique_vals.push({
                                "value": val[col_name],
                                "label": val[field_label]
                            })
                        };
                    });
                    form_data.push({
                        "DATA_TYPE":col.DATA_TYPE,
                        "COLUMN_KEY": col.COLUMN_KEY,
                        "COLUMN_NAME": col.COLUMN_NAME,
                        "TABLE_NAME": col.TABLE_NAME,
                        "UNIQUE_VALUES": unique_vals
                        //"UNIQUE_LABELS":
                    });
                } else {
                    form_data.push({
                        "DATA_TYPE":col.DATA_TYPE,
                        "COLUMN_KEY": col.COLUMN_KEY,
                        "COLUMN_NAME": col.COLUMN_NAME
                    })
                }
            });
            resolve(form_data);
        })
    })
};

// Home Page Helper to get data for modals
Services.getHomePage = function() {
    return new Promise(function(resolve, reject) {
        Services.getFormData("villager", "name")
        .then(function(form_data1) {
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
                                resolve({
                                    form_data1, 
                                    form_data2, 
                                    form_data3, 
                                    form_data4, 
                                    form_data5, 
                                    person_data
                                });
                            })
                        })
                    })
                })
            })
        })
    })
}

// Villager Shop helper to get data for each villager card
Services.getVillagerShop = function(island) {
    return new Promise(function(resolve, reject) {
        Database.getAllFromTable("island")
        .then(function(island_vals) {
            Database.getAllVillagersByIslandID(island)
            .then(function(current) {
                Database.getVillagersNotOnIslandID(island)
                .then(function(available) {
                    available.forEach((data) => {
                        data.islID = island
                    });
                    Database.getAllFromTable("personality")
                    .then(function(personalities) {
                        resolve({
                            personalities,
                            island,
                            island_vals,
                            current,
                            available
                        });
                    })
                })
            })
        })
    })
}

// Facility shop helper to get data for each facility card
Services.getFacilityShop = function(island) {
    return new Promise(function(resolve, reject) {
        Database.getAllFromTable("island")
        .then(function(island_vals) {
            Database.getAllFacilitiesByIslandID(island)
            .then(function(current) {
                Database.getFacilitiesNotOnIslandID(island)
                .then(function(available) {
                    available.forEach((data) => {
                        data.islID = island
                    });

                    resolve({
                        island,
                        island_vals,
                        current,
                        available
                    });
                })
            })
        })
    })
}

// Island page helper to get all Island data for Island cards
Services.getIslands = function() {
    return new Promise(function(resolve, reject) {
        Database.getAllIslands()
        .then(async function(names) {
            var island_data = [];
            for (name of names) {
                const villagers = await Database.getAllVillagersByIslandID(name.islandID);
                var villager_names = [];
                villagers.forEach((name) => {                        
                    villager_names.push(name.name)
                });
                const facilities = await Database.getAllFacilitiesByIslandID(name.islandID);
                var facility_names = [];
                facilities.forEach((name) => {
                    facility_names.push(name.name)
                });
                island_data.push({
                    "name": name.name,
                    "islandID": name.islandID,
                    "villagers": villager_names,
                    "facilities": facility_names
                });
            };
            resolve(island_data);
        })
    })
}

module.exports = Services;