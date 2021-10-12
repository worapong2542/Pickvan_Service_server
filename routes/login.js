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

router.get("/users", async (req, res) => {
  const conn = await mysql.createConnection(db);
  let sql = "SELECT * FROM customer";
  const [rows, fields] = await conn.execute(sql);
  res.json(rows);
});

router.post("/login", async (req, res) => {
  const conn = await mysql.createConnection(configDB);
  let sql = "SELECT * FROM users WHERE email=? AND password=? ";
  const [rows, fields] = await conn.execute(sql, [
    req.body.email,
    req.body.password,
  ]);
  res.status(201).json(rows);
});

router.post("/register", async (req, res) => {
  const conn = await mysql.createConnection(configDB);
  let sql = "INSERT INTO `users` (`email`,`password`,`name`) VALUES(?,?,?) ";
  const query = await conn.execute(sql, [
    req.body.email,
    req.body.password,
    req.body.name,
  ]);
  res.status(201).json(query);
});

module.exports = router;
