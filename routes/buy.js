const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bodyparser = require("body-parser");
const cron = require("node-cron");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pickvan",
});
db.connect(function (err) {
  if (err) console.log(err);
});
const value_for_key = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

let count = 0;
function gen_key() {
  const today = new Date();
  if (count > 61) {
    count = 0;
  }
  return (
    value_for_key[today.getFullYear() - 2021] +
    value_for_key[today.getMonth()] +
    value_for_key[today.getDate() - 1] +
    value_for_key[today.getHours()] +
    value_for_key[today.getMinutes()] +
    value_for_key[today.getSeconds()] +
    value_for_key[count++]
  );
}

router.get("/test", function (req, res) {
  const key = "key value is " + gen_key();
  res.send(key);
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
    today.getFullYear() +
    "" +
    (today.getMonth() + 11) +
    "" +
    (today.getDate() + 10);
  const time =
    today.getHours() +
    10 +
    "" +
    (today.getMinutes() + 10) +
    "" +
    (today.getSeconds() + 10);
  const dateTime_exp = date + "" + time;
  const sql_check =
    "SELECT `ticket`.`seat_amount` FROM `ticket` INNER JOIN `schedule` ON `ticket`.`schedule_id` = `schedule`.`schedule_id` WHERE `schedule`.`schedule_id` =" +
    schedule_id +
    " AND `ticket`.`status_id` < 3";
  db.query(sql_check, function (err, result) {
    for (i in result) {
      temp_seat += result[i].seat_amount;
    }
    if (seat_all_van - temp_seat > 0) {
      if (seat_amount <= seat_all_van - temp_seat) {
        const key = gen_key();
        const sql_insert =
          "INSERT INTO `ticket`(`ticket_id`, `customer_id`, `schedule_id`, `pickup_point`, `getdown_point`, `seat_amount`, `receipt_img`, `status_id`, `time_on_buy`, `time_exp`) VALUES ('" +
          key +
          "','" +
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
        db.query(sql_insert, function (err, result) {
          console.log(result);
          if (err) {
            res.send("1");
          } else {
            res.send(key);
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

router.get(
  "/walkin_add/:id/:point_down/:seat_buy/:seat_all_van",
  function (req, res) {
    const id = req.params.id;
    const point_down = req.params.point_down;
    const seat_buy = req.params.seat_buy;
    const seat_all_van = req.params.seat_all_van;
    let temp_seat = 0;
    const today = new Date();
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
      "INSERT INTO `ticket` (`ticket_id`, `customer_id`, `schedule_id`, `pickup_point`, `getdown_point`, `seat_amount`, `receipt_img`, `status_id`, `time_on_buy`, `time_exp`) VALUES ('" +
      gen_key() +
      "', '0', '" +
      id +
      "', '', '" +
      point_down +
      "', '" +
      seat_buy +
      "', '', '2', current_timestamp(), '" +
      dateTime +
      "')";
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
              res.send("เพิ่มที่นั่งเรียบร้อย");
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
// cron.schedule("* * * * * *", () => {
//   const today = new Date();
//   const date =
//     today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
//   const time =
//     today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
// });

module.exports = router;
