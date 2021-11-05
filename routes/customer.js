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
  const seat_select = 2;
  let seat_onbuy = 0;
  let temp_schedule_id = [];
  let data = [];
  sql =
    "SELECT `schedule`.*,`ticket`.`seat_amount`,`ticket`.`status_id`,`destination`.`name`,`van`.`van_seat` FROM `schedule` LEFT JOIN `ticket` ON `schedule`.`schedule_id` = `ticket`.`schedule_id` LEFT JOIN `van` ON `schedule`.`license_plate`=`van`.`license_plate` LEFT JOIN `destination` ON `van`.`destination_id` = `destination`.`destination_id` WHERE `schedule`.`date` = '" +
    req.params.date +
    "' AND `destination`.`name` = '" +
    req.params.location +
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
    console.log(data);
    res.send(data);
  });
});

router.post("/buyticket", function (req, res) {
  const user_id = req.body.user_id;
  const point_up = req.body.point_up;
  const point_down = req.body.point_down;
  const seat_amount = req.body.seat_amount;
  const schedule_id = req.body.schedule_id;
  const seat_all_van = req.body.seat_all;
  let temp_seat = 0;

  const today = new Date(new Date().getTime() + 600000);
  const date =
    today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
  const time =
    today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
  const dateTime_exp = date + "" + time;
  const sql_check =
    "SELECT `ticket`.`seat_amount` FROM `ticket` INNER JOIN `schedule` ON `ticket`.`schedule_id` = `schedule`.`schedule_id` WHERE `schedule`.`schedule_id` =" +
    schedule_id +
    " AND `ticket`.`status_id` < 3";
  const sql_insert =
    "INSERT INTO `ticket`(`ticket_id`, `customer_id`, `schedule_id`, `pickup_point`, `getdown_point`, `seat_amount`, `receipt_img`, `status_id`, `time_on_buy`, `time_exp`) VALUES (NULL,'" +
    user_id +
    "','" +
    schedule_id +
    "','" +
    point_up +
    "','" +
    point_down +
    "','" +
    seat_amount +
    "','','0',current_timestamp(),'" +
    dateTime_exp +
    "')";
  //console.log(sql_check)
  console.log(sql_insert);
  db.query(sql_check, function (err, result) {
    for (i in result) {
      temp_seat += result[i].seat_amount;
    }
    if (seat_all_van - temp_seat > 0) {
      if (seat_amount <= seat_all_van - temp_seat) {
        db.query(sql_insert, function (err, result) {
          if (err) {
            res.send("1");
          } else {
            res.send(result.insertId.toString());
          }
        });
      } else {
        res.send("1");
      }
    } else {
      res.send("1");
    }
  });
});

router.post("/upload_img", function (req, res) {
  const sql =
    "SELECT * FROM `ticket` WHERE `ticket_id` = '" + req.body.ticket_id + "'";
  db.query(sql, function (err, result) {
    console.log(result[0].status_id);
    if (result[0].status_id < 3) {
      const sql_upload =
        "UPDATE `ticket` SET `receipt_img` = '" +
        req.body.photo +
        "' , `status_id` = '2' WHERE `ticket`.`ticket_id` = '" +
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
  console.log(date);
  const sql =
    "SELECT * FROM `schedule` INNER JOIN `ticket` ON `schedule`.`schedule_id` = `ticket`.`schedule_id` INNER JOIN `van` ON `van`.`license_plate` = `schedule`.`license_plate` INNER JOIN `destination` ON`destination`.`destination_id` = `van`.`destination_id` WHERE `ticket`.`customer_id` = '" +
    req.params.id +
    "' AND `schedule`.`date` = '" +
    date +
    "'";
  db.query(sql_upload, function (err, result) {
    if (err) {
      res.send("เกิดข้อผิดผลาด");
    } else {
      res.send(result);
    }
  });
});

router.get("/test", function (req, res) {
  let text = '{"name":"John", "age":30, "city":"New York"}';
  const obj = JSON.parse(text);
  res.send(obj.name);
});

///+sec*1000
//const today = new Date(new Date().getTime() + 600000);

module.exports = router;
