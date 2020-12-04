var table = document.getElementsByTagName("table")[0];
var tbody = table.getElementsByTagName("tbody")[0];
var buttons = document.getElementsByClassName("button2");

// Event listener to update buttons
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (updateButton));
}

// Get data from row of update button clicked
function updateButton(event) {
    var data = [];
    var target = event.target;
    if (!target) return;
    if (!(tbody.contains(target))) return;

    while (target && target.nodeName !== "TR") {
        target = target.parentNode;
    };
    if (target) {
        var cells = target.getElementsByTagName("td");
        for (var i = 0; i < cells.length - 2; i++) {
            data.push(cells[i].textContent);
        }
    };
    createModalData(data)
};

// Set up column names 
function createModalData(data) {
    modalData = data.slice(0, );
    if (table.id == "species" || table.id == "island") {
        column_names = [table.id + "ID", "name"];
    }
    console.log(table.id + "ID")
    if (table.id == "facility") {
        column_names = ["facilityID", "name", "available"];
    }
    if (table.id == "villager") {
        column_names = ["villagerID", "name", "birthday", "hobby", "image_url", "species", "personality"];
        var dates = new Date(modalData[2]);
        var new_date = dates.toISOString();
        new_date = new_date.slice(0, 10);
        modalData[2] = new_date;
    }
    if (table.id == "personality") {
        column_names = ["personalityID", "name", "description", "wakeTime", "sleepTime", "activities"]
    }
    if (table.id == "island_villager") {
        column_names = ["island_villagerID", "islandID", "villagerID"]
    } 
    if (table.id == "island_facility") {
        column_names = ["island_facilityID", "islandID", "facilityID"]

    }
    if (table.id == "compatibility") {
        column_names = ["compatibilityID", "p1", "p2"]
    } 
    openModal(modalData, column_names)
}

// Open update modal with prepopulated info
function openModal(modalData, column_names) {
    $(window).on('shown.bs.modal', function(a) {
        var button = a.relatedTarget;

        if($(button).hasClass('no-modal')) {
            e.stopPropagation();
        }
        $('#update-modal').modal('show');
        var submit = document.getElementById("submit1")
        if (table.id == "island_villager" || table.id == "island_facility" || table.id == "compatibility") {
            var column1 = document.getElementById(column_names[1])
            var column2 = document.getElementById(column_names[2])
            var null_option = document.createElement("option");
            var null_option2 = document.createElement("option");
            null_option.text = "NULL";
            null_option.value = 0;
            null_option.id = "null1"
            null_option2.text = "NULL";
            null_option2.value = 0;
            null_option2.id = "null2"
            if (!(document.getElementById("null1") || document.getElementById("null2"))) {
                column1.add(null_option);
                column2.add(null_option2);
            }
        }
        submit.addEventListener('click', function(event) {
            updateData();
            event.preventDefault();
        })
        for (i = 0; i < modalData.length; i++) {
            document.getElementById(column_names[i]).value = modalData[i];
        }
    });
    $("#update-modal").modal();
}

// Ajax put call
function updateData() {
    $.ajax({
        url: '/' + table.id + '/update', 
        type: "PUT", 
        data: $('#form1').serialize(), 
        success: function() {
            window.location.replace('/' + table.id + '/all')
        },
        error: function() {
            window.location.replace('/' + table.id + '/all')
        }
    })

}
