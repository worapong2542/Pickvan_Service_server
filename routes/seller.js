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

router.get("/vandata", function (req, res) {
  let temp_license_plate = [];
  let temp_data = [];
  let setroute = [];
  const sql_destination = "SELECT `destination`.* FROM `destination`";
  db.query(sql_destination, function (err, result) {
    for (i in result) {
      temp_data.push(result[i].name);
    }
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
  const date = req.params.date;
  let data_format = [];
  const sql =
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
        price: result[i].price,
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
    const time = req.params.time + ":" + "00" + "." + "0000";
    const day = req.params.day;
    const month = req.params.month;
    const year = req.params.year;
    const price = req.params.price;
    const license_plate = req.params.license_plate;
    const date = +year + "/" + month + "/" + day;
    const sql =
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

router.get("/ticketdata/:id", function (req, res) {
  const id = req.params.id;
  let walkin = 0;
  let app = 0;
  let ticket_id = "";
  let ticket_id_waiting = "";
  let waiting = 0;
  var sql =
    "SELECT * FROM `ticket` INNER JOIN `schedule` ON `ticket`.`schedule_id` = `schedule`.`schedule_id` WHERE `schedule`.`schedule_id` = " +
    id +
    " ORDER BY `ticket`.`ticket_id` ASC";
  db.query(sql, function (err, result) {
    for (i in result) {
      if (result[i].status_id == 3) {
      } else if (result[i].customer_id == 0) {
        walkin += result[i].seat_amount;
      } else if (result[i].status_id == 1 || result[i].status_id == 0) {
        waiting += result[i].seat_amount;
        ticket_id_waiting += result[i].ticket_id + ",  ";
      } else {
        app += result[i].seat_amount;
        ticket_id += result[i].ticket_id + ",  ";
      }
    }
    res.send({
      ticket_id: ticket_id,
      walkin: walkin,
      app: app,
      ticket_id_waiting: ticket_id_waiting,
      waiting_amount: waiting,
    });
  });
});

router.get("/checkticket/", function (req, res) {
  const sql =
    "SELECT `ticket`.`ticket_id`,`destination`.`name`,`schedule`.`time`,`schedule`.`date`,`ticket`.`seat_amount`,`schedule`.`price`,`customer`.`customer_phone_num`,`customer`.`customer_userName` FROM `ticket` INNER JOIN `schedule` ON `ticket`.`schedule_id` = `schedule`.`schedule_id` INNER JOIN `van` ON `schedule`.`license_plate` = `van`.`license_plate` INNER JOIN `destination` ON `destination`.`destination_id` = `van`.`destination_id` INNER JOIN `customer` ON `ticket`.`customer_id` = `customer`.`customer_id` WHERE `ticket`.`status_id` = '1'";
  db.query(sql, function (err, result) {
    res.send(result);
  });
});

router.get("/history_ticket", function (req, res) {
  const today = new Date();
  const date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    (today.getDate() - 1);
  const sql =
    "SELECT `ticket`.`ticket_id`,`destination`.`name`,`schedule`.`time`,`schedule`.`date`,`ticket`.`seat_amount`,`schedule`.`price`,`customer`.`customer_phone_num`,`customer`.`customer_userName`,`ticket`.`status_id` FROM `ticket` INNER JOIN `schedule` ON `ticket`.`schedule_id` = `schedule`.`schedule_id` INNER JOIN `van` ON `schedule`.`license_plate` = `van`.`license_plate` INNER JOIN `destination` ON `destination`.`destination_id` = `van`.`destination_id` INNER JOIN `customer` ON `ticket`.`customer_id` = `customer`.`customer_id` WHERE `schedule`.`date` >= '" +
    date +
    "' AND `customer`.`customer_id` != 0 ORDER BY `ticket`.`ticket_id` ASC";
  db.query(sql, function (err, result) {
    res.send(result);
  });
});

router.get("/get_img/:id", function (req, res) {
  const sql =
    "SELECT `ticket`.`receipt_img` FROM `ticket` WHERE `ticket`.`ticket_id` = '" +
    req.params.id +
    "'";
  db.query(sql, function (err, result) {
    res.send(result[0].receipt_img);
  });
});

router.get("/update/:ticket_id/:status", function (req, res) {
  const ticket_id = req.params.ticket_id;
  const status = req.params.status;
  const sql =
    "UPDATE `ticket` SET `status_id` = '" +
    status +
    "' WHERE `ticket`.`ticket_id` = '" +
    ticket_id +
    "'";
  db.query(sql, function (err, result) {
    if (err) {
      console.log("Error");
    } else {
      res.send("อัพเดตเรียบร้อย");
    }
  });
});

router.get("/get_auto_schedule_data", function (req, res) {
  const sql =
    "SELECT `auto_schedule`.* ,`van`.`van_seat`,`destination`.`name` FROM `auto_schedule` INNER JOIN `van` ON `van`.`license_plate` = `auto_schedule`.`license_plate` INNER JOIN `destination` ON `destination`.`destination_id` = `van`.`destination_id` ORDER BY `auto_schedule`.`time` ASC";
  db.query(sql, function (err, result) {
    res.send(result);
  });
});

router.get("/auto_schedule_del/:id/", function (req, res) {
  const sql =
    "DELETE FROM `auto_schedule` WHERE `auto_schedule`.`id` = " + req.params.id;
  db.query(sql, function (err, result) {
    if (err) {
      res.send("เกิดข้อผิดผลาด กรุณาลองใหม่อีกครั้ง");
    } else {
      res.send("ลบข้อมูลเรียบร้อย");
    }
  });
});

router.get("/auto_schedule_update/:id/:time/:price", function (req, res) {
  const sql =
    "UPDATE `auto_schedule` SET `price`='" +
    req.params.price +
    "',`time`='" +
    req.params.time +
    "' WHERE `id` = '" +
    req.params.id +
    "'";
  db.query(sql, function (err, result) {
    if (err) {
      res.send("เกิดข้อผิดผลาด กรุณาลองใหม่อีกครั้ง");
    } else {
      res.send("แก้ไขข้อมูลเรียบร้อย");
    }
  });
});

router.get(
  "/auto_schedule_add/:time/:price/:license_plate",
  function (req, res) {
    const sql =
      "INSERT INTO `auto_schedule` (`id`, `license_plate`, `price`, `time`) VALUES (NULL, '" +
      req.params.license_plate +
      "', '" +
      req.params.price +
      "', ' " +
      req.params.time +
      "');";
    db.query(sql, function (err, result) {
      if (err) {
        res.send("เกิดข้อผิดผลาด กรุณาลองใหม่อีกครั้ง");
      } else {
        res.send("เพิ่มข้อมูลเรียบร้อย");
      }
    });
  }
);

module.exports = router;
