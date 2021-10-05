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

router.get("/vandata", function (req, res) {
  let temp_license_plate = [];
  let temp_data = [];
  let setroute = [];
  const sql_destination = "SELECT `destination`.* FROM `destination`";
  db.query(sql_destination, function (err, result) {
    for (i in result) {
      temp_data.push(result[i].name);
    }
    temp_data;
  });
  const sql =
    "SELECT `van`.`license_plate`,`destination`.`name` FROM `van` JOIN `destination` ON `van`.`destination_id`=`destination`.`destination_id`";
  db.query(sql, function (err, result) {
    for (i in temp_data) {
      temp_license_plate = [];
      for (x in result) {
        if (result[x].name == temp_data[i]) {
          temp_license_plate.push({ title: result[x].license_plate });
        }
      }
      setroute.push({ title: temp_data[i], license: temp_license_plate });
    }
    res.send(setroute);
  });
});

router.get("/getschedule/:date", function (req, res) {
  var date = req.params.date;
  let data_format = [];
  var sql =
    "SELECT * FROM `schedule` JOIN `van` ON `schedule`.`license_plate` = `van`.`license_plate` JOIN `destination` ON `van`.`destination_id` = `destination`.`destination_id` WHERE `schedule`.`date` =" +
    "'" +
    date +
    "' ORDER BY `schedule`.`time` ASC";
  db.query(sql, function (err, result) {
    for (i in result) {
      data_format.push({
        id: result[i].schedule_id,
        time: result[i].time,
        destination: result[i].name,
        license: result[i].license_plate,
      });
    }
    res.send(data_format);
  });
});

router.get("/getschedule_select_id/:id/:license", function (req, res) {
  const id = req.params.id;
  const license = req.params.license;
  let vanseat;
  let point_down = [];
  const van_sql =
    "SELECT `van`.`license_plate`,`van`.`van_seat`,`destination_detail`.`pick_point`,`destination_detail`.`state` FROM `van` INNER JOIN `destination_detail` ON `van`.`destination_id` = `destination_detail`.`destination_id` WHERE `van`.`license_plate` = '" +
    license +
    "' AND `destination_detail`.`state` = 2";
  db.query(van_sql, function (err, result) {
    vanseat = result[0].van_seat;
    for (i in result) {
      point_down.push(result[i].pick_point);
    }
  });
  const sql =
    "SELECT * FROM `ticket` INNER JOIN `schedule` ON `ticket`.`schedule_id` = `schedule`.`schedule_id` WHERE `schedule`.`schedule_id` =" +
    id +
    " AND `ticket`.`status_id` < 3";
  db.query(sql, function (err, result) {
    let set_free = vanseat;
    for (i in result) {
      set_free -= result[i].seat_amount;
    }
    res.send({ vanseat: vanseat, point_down: point_down, set_free: set_free });
  });
});

router.get(
  "/addschedule/:time/:day/:month/:year/:price/:license_plate",
  function (req, res) {
    var time = req.params.time + ":" + "00" + "." + "0000";
    var day = req.params.day;
    var month = req.params.month;
    var year = req.params.year;
    var price = req.params.price;
    var license_plate = req.params.license_plate;
    var date = +year + "/" + month + "/" + day;
    var sql =
      "INSERT INTO `schedule` (`schedule_id`, `time`, `date`, `price`, `license_plate`) VALUES(NULL,'" +
      time +
      "','" +
      date +
      "','" +
      price +
      "','" +
      license_plate +
      "')";
    db.query(sql, function (err, result) {
      if (err) {
        res.send("1");
      } else {
        res.send("0");
      }
    });
  }
);

router.get(
  "/walkin_add/:id/:point_down/:seat_buy/:seat_all_van",
  function (req, res) {
    const id = req.params.id;
    const point_down = req.params.point_down;
    const seat_buy = req.params.seat_buy;
    const seat_all_van = req.params.seat_all_van;
    let temp_seat = 0;
    ///+sec*1000
    const today = new Date(new Date().getTime() + 600000);
    const date =
      today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
    const time =
      today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
    const dateTime = date + "" + time;
    const sql_check =
      "SELECT `ticket`.`seat_amount` FROM `ticket` INNER JOIN `schedule` ON `ticket`.`schedule_id` = `schedule`.`schedule_id` WHERE `schedule`.`schedule_id` =" +
      id +
      " AND `ticket`.`status_id` < 3";
    const sql =
      "INSERT INTO `ticket` (`ticket_id`, `customer_id`, `schedule_id`, `pickup_point`, `getdown_point`, `seat_amount`, `receipt_img`, `status_id`, `time_on_buy`, `time_exp`) VALUES (NULL, '0', '" +
      id +
      "', '', '" +
      point_down +
      "', '" +
      seat_buy +
      "', '', '0', current_timestamp(), '" +
      dateTime +
      "')";
    console.log(sql);
    db.query(sql_check, function (err, result) {
      for (i in result) {
        temp_seat += result[i].seat_amount;
      }
      if (seat_all_van - temp_seat > 0) {
        if (seat_buy <= seat_all_van - temp_seat) {
          db.query(sql, function (err, result) {
            if (err) {
              res.send("เกิดข้อผิดผลาด กรุณาลองใหม่อีกครั้ง");
            } else {
              res.send("เพิ่มรอบรถเรียบร้อย");
            }
          });
        } else {
          res.send("เกิดข้อผิดผลาด กรุณาลองใหม่อีกครั้ง");
        }
      } else {
        res.send("เกิดข้อผิดผลาด กรุณาลองใหม่อีกครั้ง");
      }
    });
  }
);

router.get("/ticketdata/:id", function (req, res) {
  const id = req.params.id;
  let walkin = 0;
  let app = 0;
  let ticket_id = "";
  var sql =
    "SELECT * FROM `ticket` INNER JOIN `schedule` ON `ticket`.`schedule_id` = `schedule`.`schedule_id` WHERE `schedule`.`schedule_id` = " +
    id +
    " ORDER BY `ticket`.`ticket_id` ASC";
  db.query(sql, function (err, result) {
    for (i in result) {
      if (result[i].customer_id == 0) {
        walkin += result[i].seat_amount;
      } else {
        app += result[i].seat_amount;
        ticket_id += result[i].ticket_id + ",  ";
      }
    }
    res.send({ ticket_id: ticket_id, walkin: walkin, app: app });
  });
});

router.get("/checkticket/", function (req, res) {
  const sql = "SELECT `ticket`.`time_on_buy` FROM `ticket` ";
  db.query(sql, function (err, result) {
    if (result[0].time_on_buy < result[1].time_on_buy) {
      console.log("1");
    }
    res.send(result[0].time_on_buy);
  });
});

router.get("/update/:ticket_id/:status", function (req, res) {
  var status = req.params.status;
  var ticket_id = req.params.ticket_id;
  var sql =
    "UPDATE `ticket` SET `status_id` = '" +
    status +
    "' WHERE `ticket`.`ticket_id` = '" +
    ticket_id +
    "'";
  //UPDATE `ticket` SET `status_id` = '3' WHERE `ticket`.`ticket_id` = 1;
  db.query(sql, function (err, result) {
    if (err) {
      console.log("Error");
    } else {
      res.send("check");
    }
  });
});

module.exports = router;
