const express = require("express");
var router = express.Router();
var mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pickvan",
});

db.connect(function (err) {
  if (err) console.log(err);
});

router.get("/destination", function (req, res) {
  let temp_name_route = [];
  let point_up = [];
  let point_down = [];
  let routedata = [];
  const sql_destination = "SELECT `destination`.* FROM `destination`";
  db.query(sql_destination, function (err, result) {
    for (i in result) {
      temp_name_route.push(result[i].name);
    }
  });
  const sql =
    "SELECT * FROM `destination` JOIN `destination_detail` ON `destination`.`destination_id` = `destination_detail`.`destination_id`";
  db.query(sql, function (err, result) {
    for (i in temp_name_route) {
      for (x in result) {
        if (result[x].name == temp_name_route[i]) {
          if (result[x].state == 1) {
            point_up.push({ title: result[x].pick_point });
          } else {
            point_down.push({ title: result[x].pick_point });
          }
        }
      }
      routedata.push({ title: temp_name_route[i],point_up:point_up,point_down:point_down});
      point_up = [];
      point_down = [];
    }
    res.send(routedata);
  });
});
///+sec*1000
//const today = new Date(new Date().getTime() + 600000);

module.exports = router;
