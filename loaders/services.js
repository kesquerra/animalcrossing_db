var Services = {};
var Database = require("../models/database.js");

Services.getFormData = function(table, field_label) {
    return new Promise(function(resolve, reject) {
        Database.getAllFieldNames(table)
        .then(function(result) {
            var form_data = [];
            result.forEach(async (col) => {
                //console.log(col);
                if (col.COLUMN_KEY == 'MUL') {
                    const uniques = await Database.getUniqueFromTableByField(table, col.COLUMN_NAME, field_label);
                    var unique_vals = [];
                    uniques.forEach((val) => {
                        if (val[col.COLUMN_NAME] != 'null') {
                            unique_vals.push({
                                "value": val[col.COLUMN_NAME],
                                "label": val[field_label]
                            })
                        };
                    });
                    form_data.push({
                        "DATA_TYPE":col.DATA_TYPE,
                        "COLUMN_KEY": col.COLUMN_KEY,
                        "COLUMN_NAME": col.COLUMN_NAME,
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

Services.getVillagerShop = function(island) {
    return new Promise(function(resolve, reject) {
        Database.getAllFromTable("island")
        .then(function(island_vals) {
            Database.getAllVillagersByIslandID(island)
            .then(function(island_villagers) {
                Database.getVillagersNotOnIslandID(island)
                .then(function(avail_villagers) {
                    Database.getAllFromTable("personality")
                    .then(function(personalities) {
                        resolve({
                            personalities,
                            island,
                            island_vals,
                            island_villagers,
                            avail_villagers
                        });
                    })
                })
            })
        })
    })
}

module.exports = Services;