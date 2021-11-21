const express = require("express");
var router = express.Router();
var mysql = require("mysql");
const bodyparser = require("body-parser");
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

router.get("/getschedule/:date/:location", function (req, res) {
  let seat_onbuy = 0;
  let temp_schedule_id = [];
  let data = [];
  sql =
    "SELECT `schedule`.*,`ticket`.`seat_amount`,`ticket`.`status_id`,`destination`.`name`,`van`.`van_seat` FROM `schedule` LEFT JOIN `ticket` ON `schedule`.`schedule_id` = `ticket`.`schedule_id` LEFT JOIN `van` ON `schedule`.`license_plate`=`van`.`license_plate` LEFT JOIN `destination` ON `van`.`destination_id` = `destination`.`destination_id` WHERE `schedule`.`date` = '" +
    req.params.date +
    "' AND `destination`.`name` = '" +
    req.params.location +
    "' ORDER BY `schedule`.`time` ASC";
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


router.post("/upload_img", function (req, res) {
  const sql =
    "SELECT * FROM `ticket` WHERE `ticket_id` = '" + req.body.ticket_id + "'";
  db.query(sql, function (err, result) {
    if (result[0].status_id < 3) {
      const sql_upload =
        "UPDATE `ticket` SET `receipt_img` = '" +
        req.body.photo +
        "' , `status_id` = '1' WHERE `ticket`.`ticket_id` = '" +
        req.body.ticket_id +
        "';";
      db.query(sql_upload, function (err, result) {
        if (err) {
          res.send("1");
        } else {
          res.send("0");
        }
      });
    } else {
      res.send("2");
    }
  });
});

router.get("/get_myticket/:id", function (req, res) {
  const today = new Date(new Date());
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const sql =
    "SELECT * FROM `schedule` INNER JOIN `ticket` ON `schedule`.`schedule_id` = `ticket`.`schedule_id` INNER JOIN `van` ON `van`.`license_plate` = `schedule`.`license_plate` INNER JOIN `destination` ON`destination`.`destination_id` = `van`.`destination_id` WHERE `ticket`.`customer_id` = '" +
    req.params.id +
    "' AND `schedule`.`date` >= '" +
    date +
    "' ORDER BY `schedule`.`schedule_id` ASC";
  db.query(sql, function (err, result) {
    if (err) {
      res.send("เกิดข้อผิดผลาด");
    } else {
      res.send(result);
    }
  });
});

router.get("/get_driver_location/:id", function (req, res) {
  const sql =
    "SELECT `driver`.`location`,`driver`.`location_status` FROM `ticket` INNER JOIN `schedule` ON `ticket`.`schedule_id` = `schedule`.`schedule_id` INNER JOIN `van` ON `schedule`.`license_plate` = `van`.`license_plate` INNER JOIN `driver` ON `van`.`driver_id` = `driver`.`driver_id` WHERE `ticket`.`ticket_id` = '" +
    req.params.id +
    "'";
  db.query(sql, function (err, result) {
    if (result[0].location_status == 0) {
      res.send({ location_status: 0 });
    } else {
      res.send({
        location_status: 1, 
        location_detail: JSON.parse(result[0].location),
      });
    }
  });
});
router.get("/get_Status/:id", function (req, res) {
  const sql =
    "SELECT `ticket`.`status_id` FROM `ticket` WHERE `ticket_id` = '" +
    req.params.id +
    "'";
  db.query(sql, function (err, result) {
    res.send(result[0]);
  });
});

///+sec*1000
//const today = new Date(new Date().getTime() + 600000);

module.exports = router;
