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
  var pickup_pt = [];
  var down_pt = [];
  var pickup_bs = [];
  var down_bs = [];
  var sql =
    "SELECT * FROM `destination` JOIN `destination_detail` ON `destination`.`destination_id` = `destination_detail`.`destination_id`";
  db.query(sql, function (err, result) {
    for (i in result) {
      if (result[i].name == "กรุงเทพ-พัทยา") {
        if (result[i].state == 1) {
          pickup_pt.push({ title: result[i].pick_point });
        } else {
          down_pt.push({ title: result[i].pick_point });
        }
      } else {
        if (result[i].state == 1) {
          pickup_bs.push({ title: result[i].pick_point });
        } else {
          down_bs.push({ title: result[i].pick_point });
        }
      }
    }
    res.send({
      pickup_pt: pickup_pt,
      down_pt: down_pt,
      pickup_bs: pickup_bs,
      down_bs: down_bs,
    });
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