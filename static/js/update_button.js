var table = document.getElementsByTagName("table")[0];
var tbody = table.getElementsByTagName("tbody")[0];
var modal = document.getElementById("update-modal");

table.addEventListener('click', (updateButton));

function updateButton(event) {
    var data = [];
    var target = event.target.closest('a');
    if (!target) return;
    if (!table.contains(target)) return;

    /* If edit button is target, remove current event listener
    and call to editRow.*/
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

function createModalData(data) {
    if (table.id == "species" || table.id == "island") {
        column_names = ["name"];
    }
    if (table.id == "facility") {
        column_names = ["name", "available"];
    }
    if (table.id == "villager") {
        column_names = ["name", "birthday", "hobby", "image_url", "species", "personality"];
        var dates = new Date(data[2]);
        var new_date = dates.toISOString();
        new_date = new_date.slice(0, 10);
        data[2] = new_date;
    }
    if (table.id == "personality") {
        column_names = ["name", "description", "wakeTime", "sleepTime", "activities"]
    }
    if (table.id == "island_villager") {
        column_names = ["islandID", "villagerID"]
        modalData = data.slice(0, );
    } 
    if (table.id == "island_facility") {
        column_names = ["islandID", "facilityID"]
        modalData = data.slice(0, );
    }
    if (table.id == "compatibility") {
        column_names = ["p1", "p2"]
        modalData = data.slice(0, );
    } 
    if (column_names.length < data.length) {
        modalData = data.slice(1, );
    }
    console.log(modalData)
    openModal(modalData, column_names)
}

function openModal(modalData, column_names) {
    $(window).on('shown.bs.modal', function() { 
        $('#update-modal').modal('show');
        for (i = 0; i < modalData.length; i++) {
            document.getElementById(column_names[i]).value = modalData[i]
        }
    });
    $("#update-modal").modal();
}
