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
  let temp_vandata = [];
  let seat_onbuy = 0;
  let temp_schedule_id = [];
  let temp_schedule = [];
  let data = [];
  const sql_vandata =
    "SELECT `van`.`license_plate`,`van`.`van_seat` FROM `van`";
  db.query(sql_vandata, function (err, result) {
    for (y in result) {
      temp_vandata.push({
        license: result[y].license_plate,
        van_seat: result[y].van_seat,
      });
    }
    sql =
      "SELECT `schedule`.*,`ticket`.`seat_amount`,`ticket`.`status_id`,`destination`.`name` FROM `schedule` LEFT JOIN `ticket` ON `schedule`.`schedule_id` = `ticket`.`schedule_id` LEFT JOIN `van` ON `schedule`.`license_plate`=`van`.`license_plate` LEFT JOIN `destination` ON `van`.`destination_id` = `destination`.`destination_id`  WHERE `schedule`.`date` = '2021-10-06' ORDER BY `schedule`.`schedule_id` ASC";
    db.query(sql, function (err, result) {
      for (i in result) {
        if (temp_schedule_id.includes(result[i].schedule_id) === false) {
          temp_schedule_id.push(result[i].schedule_id);
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
          if (
            temp_schedule.some((item) => item.id == result[x].schedule_id) == true) {
          } else {
            temp_schedule.push({
              id: result[x].schedule_id,
              time: result[x].time,
              name: result[x].name,
              price: result[x].price,
              date: result[x].date,
              license: result[x].license_plate,
            });
          }
        }
        temp_schedule[i]["seat_onbuy"] = seat_onbuy
        seat_onbuy = 0;
      }
      for (h in temp_schedule) {
        for (u in temp_vandata) {
          if (temp_vandata[u].license == temp_schedule[h].license) {
            data.push({
              id: temp_schedule[h].id,
              time: temp_schedule[h].time,
              name: temp_schedule[h].name,
              price: temp_schedule[h].price,
              date: temp_schedule[h].date,
              seat_onbuy: temp_schedule[h].seat_onbuy,
              license: temp_vandata[u].license,
              van_seat: temp_vandata[u].van_seat,
            });
            break;
          }
        }
      }
      res.send(data);
    });
  });
});

router.get("/test", function (req, res) {
  const pets = ["cat", "dog", "bat"];
  let x = 0;
  res.send("1");
});

///+sec*1000
//const today = new Date(new Date().getTime() + 600000);

module.exports = router;

