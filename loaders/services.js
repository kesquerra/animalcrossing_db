var Services = {};
var Database = require("../models/database.js");

Services.getFormData = function(table) {
    return new Promise(function(resolve, reject) {
        Database.getAllFieldNames(table)
        .then(function(result) {
            var form_data = [];
            result.forEach(async (col) => {
                //console.log(col);
                if (col.COLUMN_KEY == 'MUL') {
                    const uniques = await Database.getUniqueFromTableByField(table, col.COLUMN_NAME);
                    var unique_vals = [];
                    uniques.forEach((val) => {
                        if (val[col.COLUMN_NAME] != 'null') {
                            unique_vals.push(val[col.COLUMN_NAME]);
                        };
                    });
                    form_data.push({
                        "DATA_TYPE":col.DATA_TYPE,
                        "COLUMN_KEY": col.COLUMN_KEY,
                        "COLUMN_NAME": col.COLUMN_NAME,
                        "UNIQUE_VALUES": unique_vals
                    });
                    /*Database.getUniqueFromTableByField(table, col.COLUMN_NAME)
                    .then(function(uniques) {
                        form_data.push({
                            "DATA_TYPE":col.DATA_TYPE,
                            "COLUMN_KEY": col.COLUMN_KEY,
                            "COLUMN_NAME": col.COLUMN_NAME,
                            "UNIQUE_VALUES": uniques
                        });
                        //console.log(form_data);
                    })
                    .catch(reject);*/
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

module.exports = Services;