const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");

var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "burgers_db"
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId);
});

// Use Handlebars to render the main index.html page with the burgers in it.
app.get("/", function(req, res) {
    connection.query("SELECT * FROM burgers;", function(err, data) {
      if (err) {
        return res.status(500).end(); // status 500 range is like 404 error except it's 500. end prevents execution of next line
      }
  
      res.render("index", { burgers: data });
    });
  });
  
  // Create a new burger
  app.post("/api/burgers", function(req, res) {
    connection.query("INSERT INTO burgers (burger_name) VALUES (?)", [req.body.burger_name], function(err, result) { // if only one string of object then req.body becomes array. if VALUES has more then it becomes an object
      if (err) {
        return res.status(500).end();
      }
  
      // Send back the ID of the new burger_name
      res.json({ id: result.insertId });
      console.log({ id: result.insertId });
    });
  });
  
  // Update a burger
  app.put("/api/burgers/:id", function(req, res) { // app.put is an UPDATE METHOD
    connection.query("UPDATE burgers SET burger_name = ? WHERE id = ?", [req.body.burger_name, req.params.id], function(err, result) {
      if (err) {
        // If an error occurred, send a generic server failure
        return res.status(500).end();
      }
      else if (result.changedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();
  
    });
  });
  
  // Delete a burger
  app.delete("/api/burgers/:id", function(req, res) {
    connection.query("DELETE FROM burgers WHERE id = ?", [req.params.id], function(err, result) {
      if (err) { // [req.params.id] is targeting the path
        // If an error occurred, send a generic server failure
        return res.status(500).end();
      }
      else if (result.affectedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();
      // res.redirect("/"); to redirect
  
    });
  });
  
  // Start our server so that it can begin listening to client requests.
  app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });
  