const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pickvan",
});

db.connect(function (err) {
  if (err) console.log(err);
});

const bodyparser = require("body-parser");

router.get("/driver_getpoint_down/:id", function (req, res) {
  const id = req.params.id;
  const time_2_future = new Date(new Date().getTime() + 7200000);
  const time_2_past = new Date(new Date().getTime() - 7200000);
  const settime_2_future =
    time_2_future.getHours() +
    "" +
    time_2_future.getMinutes() +
    "" +
    time_2_future.getSeconds();
  const settime_2_past =
    time_2_past.getHours() +
    "" +
    time_2_past.getMinutes() +
    "" +
    time_2_past.getSeconds();
  const date =
    time_2_future.getFullYear() +
    "" +
    (time_2_future.getMonth() + 1) +
    "" +
    time_2_future.getDate();
  const sql =
    "SELECT `ticket`.`seat_amount`, `ticket`.`getdown_point`, `ticket`.`ticket_id` FROM `ticket`  INNER JOIN `schedule` ON `schedule`.`schedule_id` = `ticket`.`schedule_id` INNER JOIN `van` ON `van`.`license_plate` = `schedule`.`license_plate` WHERE `van`.`driver_id` = 'Dv1' AND `schedule`.`time` <= '010:00:00' AND `schedule`.`time` >= '08:00:00' AND `schedule`.`date` = '2021-10-06'";
  let point_temp = [];
  let seat_temp = 0;
  let ticket_id_temp = "";
  let data = [];
  db.query(sql, function (err, result) {
    for (i in result) {
      if (point_temp.includes(result[i].getdown_point) === false) {
        point_temp.push(result[i].getdown_point);
      }
    }
    for (x in point_temp) {
      for (h in result) {
        if (result[h].getdown_point == point_temp[x]) {
          seat_temp += result[h].seat_amount;
          ticket_id_temp += " " + result[h].ticket_id;
        }
      }
      data.push({
        point: point_temp[x],
        amount_all: seat_temp,
        id: ticket_id_temp,
      });
      seat_temp = 0;
      ticket_id_temp = "";
    }
    res.send(data);
  });
});

router.get("/driver_getpoint_up/:id", function (req, res) {
  const id = req.params.id;
  const time_2_future = new Date(new Date().getTime() + 7200000);
  const time_2_past = new Date(new Date().getTime() - 7200000);
  const settime_2_future =
    time_2_future.getHours() +
    "" +
    time_2_future.getMinutes() +
    "" +
    time_2_future.getSeconds();
  const settime_2_past =
    time_2_past.getHours() +
    "" +
    time_2_past.getMinutes() +
    "" +
    time_2_past.getSeconds();
  const date =
    time_2_future.getFullYear() +
    "" +
    (time_2_future.getMonth() + 1) +
    "" +
    time_2_future.getDate();
  const sql =
    "SELECT `ticket`.`seat_amount`, `ticket`.`pickup_point`, `ticket`.`ticket_id` FROM `ticket`  INNER JOIN `schedule` ON `schedule`.`schedule_id` = `ticket`.`schedule_id` INNER JOIN `van` ON `van`.`license_plate` = `schedule`.`license_plate` WHERE `van`.`driver_id` = 'Dv1' AND `schedule`.`time` <= '010:00:00' AND `schedule`.`time` >= '08:00:00' AND `schedule`.`date` = '2021-10-06'";
  let point_temp = [];
  let seat_temp = 0;
  let ticket_id_temp = "";
  let data = [];
  db.query(sql, function (err, result) {
    for (i in result) {
      if (result[i].pickup_point == "") {
      } else {
        if (point_temp.includes(result[i].pickup_point) === false) {
          point_temp.push(result[i].pickup_point);
        }
      }
    }
    for (x in point_temp) {
      for (h in result) {
        if (result[h].pickup_point == point_temp[x]) {
          seat_temp += result[h].seat_amount;
          ticket_id_temp += " " + result[h].ticket_id;
        }
      }
      data.push({
        point: point_temp[x],
        amount_all: seat_temp,
        id: ticket_id_temp,
      });
      seat_temp = 0;
      ticket_id_temp = "";
    }
    res.send(data);
  });
});

router.post("/login_driver", function (req, res) {
  const sql =
    "SELECT driver.driver_id,driver.driver_name FROM driver WHERE driver_email= '" +
    req.body.email +
    "' AND driver_password = '" +
    req.body.password +
    "'";
  db.query(sql, function (err, result) {
    if (result.length > 0) {
      res.send({
        status: 1,
        name: result[0].driver_name,
        driver_id: result[0].driver_id,
      });
    } else {
      res.send({ status: 0 });
    }
  });
});

router.get("/get_location/:id/:lat/:long", function (req, res) {
  // '{\"latitude\": 13.779301, \"longitude\": 100.5603960}' 
  const format_location = {latitude:req.params.lat,longitude:req.params.long};
  const sql =
    "UPDATE `driver` SET `location_status` = '1', `location` = '" +
    JSON.stringify(format_location) +
    "' WHERE `driver`.`driver_id` = '" +
    req.params.id +
    "';";
  db.query(sql, function (err, result) {
    res.send("ok")
  });
});

router.get("/del_location/:id/", function (req, res) {
  const sql =
    "UPDATE `driver` SET `location_status` = '1' WHERE `driver`.`driver_id` = '" +
    req.params.id +
    "';";
  db.query(sql, function (err, result) {
    res.send(result);
  });
});

router.get("/test", function (req, res) {
  const sql = "SELECT * FROM `driver` WHERE `driver_id` = 'Dv7'";
  db.query(sql, function (err, result) {
    let data_JSON = JSON.parse(result[0].location);
    let long = data_JSON.longitude;
    let lat = data_JSON.latitude;
    res.send(long.toString()+lat.toString());
  });
});

module.exports = router;
