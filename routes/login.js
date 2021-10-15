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

const bodyparser = require('body-parser');

router.post("/login_seller",function(req,res){
   //รับค่าจาก input มาเก็บไว้ในตัวแปร
  const email = req.body.email;
  const password = req.body.password;

  //คำสั่ง sql เลือกข้อมูลจากตาราง
  const sql = "SELECT `seller`.`seller_id`,`seller`.`seller_name` FROM `seller` WHERE `seller_mail`= '" + email + "' AND `seller_password` = '" + password + "'"
  
  db.query(sql, function (err, result) { 
    if(result.length>0){ //return ผลลัพธ์(result)จากตารางออกมา (ที่่กำหนดใน const sql)
      res.send({status:1,name:result[0].seller_name,seller_id:result[0].seller_id}) //ถ้าข้อมูลถูกต้อง ส่งข้อมูลไป font 
    }else res.send({status:0}) //ข้อมูลไม่ถูกต้อง ส่ง status 0 ไป font ให้ login ใหม่
  });
  

})

router.post("/regist_customer",function(req,res){
  //รับค่าจาก input มาเก็บไว้ในตัวแปร
  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;
  const phoneNum = req.body.phoneNum;
  
  const sql = "SELECT `customer`.`customer_email` FROM `customer` WHERE `customer_email` =  '" + email + "'"

  db.query(sql, function (err, result) { 
    if(result.length>0){ //ถ้า email ใน db ตรงกับที่รับ ให้ res เป็น 0
      res.send({status:0})
    }else{
      const sqlInsert = "INSERT INTO `customer`(`customer_id`, `customer_userName`, `customer_email`, `customer_phone_num`, `customer_password`) VALUES (NULL,'"+userName+"','"+email+"','"+password+"','"+phoneNum+"')"
      db.query(sqlInsert, function (err, result) {
      console.log(result.insertId);
        res.send({status:1,id:result.insertId})
      });
       }
  });
})


module.exports = router;
