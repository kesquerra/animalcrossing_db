var table = document.getElementsByTagName("table")[0];
var tbody = table.getElementsByTagName("tbody")[0];

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
        column_names = ["islandID", "villagerID"]
    } 
    if (table.id == "island_facility") {
        column_names = ["islandID", "facilityID"]

    }
    if (table.id == "compatibility") {
        column_names = ["p1", "p2"]
    } 
    openModal(modalData, column_names, table.id)
}

function openModal(modalData, column_names, table) {
    $(window).on('shown.bs.modal', function() {
        $('#update-modal').modal('show');
        submit = document.getElementById("submit1")
        if (table == "compatibility" || table == "island_villager" || table == "island_facility") {
            document.getElementById("id1").value = modalData[0]
            document.getElementById("id2").value = modalData[1]
        }
        submit.addEventListener('click', function(event) {
            updateData();
            event.preventDefault();
            $("#update-modal").modal("hide");
        })
        for (i = 0; i < modalData.length; i++) {
            document.getElementById(column_names[i]).value = modalData[i];
        }
    });
    $("#update-modal").modal();
}

function updateData() {
    $.ajax({
        url: '/' + table.id + '/update', 
        type: "PUT", 
        data: $('#form1').serialize(), 
        success: function(result) {
            window.location.replace('/' + table.id + '/all')
        }
    })
}
