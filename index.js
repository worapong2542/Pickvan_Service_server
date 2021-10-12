const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const seller = require("./routes/seller");
const customer = require("./routes/customer");
const user = require("./routes/login");
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

//work on time set (sec min hour day mounth)
//https://www.npmjs.com/package/node-cron
//5sec
cron.schedule("*/10 * * * * *", () => {
  const today = new Date(new Date());
  const date =
    today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
  const time =
    today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
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

cron.schedule("59 45 12 * * *", () => {
  const today = new Date(new Date().getTime() + 2 * 86400000);
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const sql_get =
    "INSERT INTO `schedule` (`schedule_id`, `time`, `date`, `price`, `license_plate`) VALUES (NULL, '9:00', '" +
    date +
    "', '120', 'กง1234'), (NULL, '15:00', '" +
    date +
    "', '120', 'นย5432'), (NULL, '12:00', '" +
    date +
    "', '160', 'ปพ8543');";
  db.query(sql_get, function (err, result) {
    console.log(result);
  });
});

app.listen("3001", () => {
  console.log("Server is running on port 3001");
});
