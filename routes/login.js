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
   
  const email = req.body.email;
  const password = req.body.password;

  const sql = "SELECT `seller`.`seller_id`,`seller`.`seller_name` FROM `seller` WHERE `seller_mail`= '" + email + "' AND `seller_password` = '" + password + "'"
  
  db.query(sql, function (err, result) { 
    if(result.length>0){ 
      res.send({status:1,name:result[0].seller_name,seller_id:result[0].seller_id})
    }else res.send({status:0}) 
  });
  

})

router.post("/regist_customer",function(req,res){

  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;
  const phoneNum = req.body.phoneNum;
  
  const sql = "SELECT `customer`.`customer_email` FROM `customer` WHERE `customer_email` =  '" + email + "'"

  db.query(sql, function (err, result) { 
    if(result.length>0){  
      res.send({status:0})
    }else{
      const sqlInsert = "INSERT INTO `customer`(`customer_id`, `customer_userName`, `customer_email`, `customer_phone_num`, `customer_password`) VALUES (NULL,'"+userName+"','"+email+"','"+phoneNum+"','"+password+"')"
      db.query(sqlInsert, function (err, result) {
      console.log(result.insertId);
        res.send({status:1,id:result.insertId})
      });
       }
  });
})


module.exports = router;
