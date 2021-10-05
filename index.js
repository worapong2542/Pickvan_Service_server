const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const seller = require('./routes/seller');
const customer = require('./routes/customer');
const auto_cron = require('./routes/auto_cron');
const cron = require('node-cron');
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
app.use('/seller', seller);
app.use('/customer', customer);

//work on time set (sec min hour day mounth)
//https://www.npmjs.com/package/node-cron

//5sec
// cron.schedule('* * 9 * * *', () => {
//   const sql = ""
// });

// cron.schedule('* 10 * * * *', () => {
//   console.log('running a task every minute');
// });

app.listen("3001", () => {
  console.log("Server is running on port 3001");
});
