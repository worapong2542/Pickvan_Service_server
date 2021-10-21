const express = require("express");
var router = express.Router();
var mysql = require("mysql");
const bodyparser = require('body-parser');
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
    "SELECT `destination`.`name`,`destination_detail`.`pick_point`,`destination_detail`.`state` FROM `destination` JOIN `destination_detail` ON `destination`.`destination_id` = `destination_detail`.`destination_id`";
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
      routedata.push({
        title: temp_name_route[i],
        point_up: point_up,
        point_down: point_down,
      });
      point_up = [];
      point_down = [];
    }
    res.send(routedata);
  });
});

router.get("/getschedule/:date", function (req, res) {
  const date = req.params.date;
  const seat_select = 2;
  let seat_onbuy = 0;
  let temp_schedule_id = [];
  let data = [];
  sql =
    "SELECT `schedule`.*,`ticket`.`seat_amount`,`ticket`.`status_id`,`destination`.`name`,`van`.`van_seat` FROM `schedule` LEFT JOIN `ticket` ON `schedule`.`schedule_id` = `ticket`.`schedule_id` LEFT JOIN `van` ON `schedule`.`license_plate`=`van`.`license_plate` LEFT JOIN `destination` ON `van`.`destination_id` = `destination`.`destination_id` WHERE `schedule`.`date` = '" +
    date +
    "' ORDER BY `schedule`.`schedule_id` ASC";
  db.query(sql, function (err, result) {
    for (h in result) {
      if (temp_schedule_id.includes(result[h].schedule_id) === false) {
        temp_schedule_id.push(result[h].schedule_id);
      }
    }
    for (i in temp_schedule_id) {
      for (x in result) {
        if (temp_schedule_id[i] == result[x].schedule_id) {
          if (result[x].status_id == null) {
          } else if (result[x].status_id == 3) {
          } else {
            seat_onbuy += result[x].seat_amount;
          }
        }
        if (data.some((item) => item.id == result[x].schedule_id) == true) {
        } else {
          data.push({
            id: result[x].schedule_id,
            time: result[x].time,
            name: result[x].name,
            price: result[x].price,
            date: result[x].date,
            license: result[x].license_plate,
            seat_all: result[x].van_seat,
          });
        }
      }
      data[i]["seat_onbuy"] = seat_onbuy;
      seat_onbuy = 0;
    }
    res.send(data);
  });
});

///+sec*1000
//const today = new Date(new Date().getTime() + 600000);

module.exports = router;
