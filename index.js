const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json({ limit: "50mb" }));
const seller = require("./routes/seller");
const customer = require("./routes/customer");
const user = require("./routes/login");
const driver = require("./routes/driver");
const cron = require("node-cron");
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

//path use
app.use("/seller", seller);
app.use("/customer", customer);
app.use("/user", user);
app.use("/driver", driver);

//work on time set (sec min hour day mounth)
//https://www.npmjs.com/package/node-cron
//5sec
cron.schedule("*/10 * * * * *", () => {
  const today = new Date(new Date());
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
  const dateTime = date + "" + time;
  const sql_get =
    "SELECT `ticket`.`ticket_id`,`ticket`.`status_id`,`ticket`.`time_exp` FROM `ticket` WHERE `ticket`.`status_id` = 0 AND `ticket`.`time_exp` <= " +
    dateTime;
  db.query(sql_get, function (err, result) {
    for (i in result) {
      if (result[i].time_exp < dateTime) {
        const sql_update =
          "UPDATE `ticket` SET `status_id` = '3' WHERE `ticket`.`ticket_id` = " +
          result[i].ticket_id;
        db.query(sql_update, function (err, result) {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  });
});

cron.schedule("1 1 1 * * *", () => {
  const sql_get = "SELECT * FROM `auto_schedule`";
  let text_insert =
    "INSERT INTO `schedule` (`schedule_id`, `time`, `date`, `price`, `license_plate`) VALUES ";
  const today = new Date(new Date().getTime() + 2 * 86400000);
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  db.query(sql_get, function (err, result) {
    for (i in result) {
      text_insert +=
        "(NULL, '" +
        result[i].time +
        "', '" +
        date +
        "', '" +
        result[i].price +
        "', '" +
        result[i].license_plate +
        "'),";
    }
    const sql = text_insert.substring(0, text_insert.length - 1);
    console.log(sql);
    db.query(sql, function (err, result) {
      console.log(result);
    });
  });
});

app.listen("3001", () => {
  console.log("Server is running on port 3001");
});
