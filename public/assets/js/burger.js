$(".devourIt").on("click", function (event) {
    // Get the ID from the button.
    // This is shorthand for $(this).attr("data-burgerid")
    var id = $(this).data("burger_nameid");

    // Send the DELETE request.
    $.ajax("/api/burgers/" + id, {
        type: "DELETE"
    }).then(
        function () {
            console.log("deleted id ", id);
            location.reload();
        }
    );
});

$("#createBurger").on("submit", function (event) {
    event.preventDefault();

    // [name=burger] will find an element with a "name" attribute equal to the string "burger"
    var newBurger = {
        burger: $("#createBurger [burger_name=burger]").val().trim()
    };

    $.ajax("/api/burgers", {
        type: "POST",
        data: newBurger
    }).then(
        function () {
            console.log("created new burger");
            location.reload();
        }
    );
});

$("#updateBurger").on("submit", function (event) {
    event.preventDefault();

    // Get the ID by finding an element with a "name" attribute equal to the string "id"
    var id = $("[burger_name=id]").val().trim();

    var updatedburger = {
        burger: $("#updateBurger [burger_name=burger]").val().trim()
    };

    // Send the PUT request.
    $.ajax("/api/burgers/" + id, {
        type: "PUT",
        data: updatedburger
    }).then(
        function () {
            console.log("updated id ", id);
            location.reload();
        }
    );
});

module.exports = burger;