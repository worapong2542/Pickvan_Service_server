const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bodyparser = require('body-parser');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pickvan",
});

db.connect(function (err) {
  if (err) console.log(err);
});

router.post("/login_seller",function(req,res){ 
  const sql = "SELECT `seller`.`seller_id`,`seller`.`seller_name` FROM `seller` WHERE `seller_mail`= '" + req.body.email + "' AND `seller_password` = '" + req.body.password + "'"
  db.query(sql, function (err, result) { 
    if(result.length>0){ 
      res.send({status:1,name:result[0].seller_name,seller_id:result[0].seller_id})
    }else res.send({status:0}) 
  });
})

router.post("/login_customer",function(req,res){
  const sql = "SELECT * FROM `customer` WHERE `customer_email`= '" + req.body.email + "' AND `customer_password` = '" + req.body.password + "'"
  db.query(sql, function (err, result) { 
    if(result.length>0){ 
      res.send({status:1,name:result[0].customer_userName,customer_id:result[0].customer_id})
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
        res.send({status:1,id:result.insertId})
      });
       }
  });
})

router.get("/driver_getpoint_up", function (req, res) {
  const time_2_future = new Date(new Date().getTime() + 7200000);
  const time_2_past = new Date(new Date().getTime() - 7200000);
  const settime_2_future = time_2_future.getHours() + "" + time_2_future.getMinutes() + "" + time_2_future.getSeconds();
  const settime_2_past = time_2_past.getHours() + "" + time_2_past.getMinutes() + "" + time_2_past.getSeconds();     
  const date = time_2_future.getFullYear() + "" + (time_2_future.getMonth() + 1) + "" + time_2_future.getDate();               
  const sql = "SELECT * FROM `ticket`  INNER JOIN `schedule` ON `schedule`.`schedule_id` = `ticket`.`schedule_id` INNER JOIN `van` ON `van`.`license_plate` = `schedule`.`license_plate` WHERE  `schedule`.`date` = '2021-10-21'"
  let point_temp = []
  let seat_temp = 0 
  let ticket_id_temp = ""
  let data = []
  db.query(sql, function (err, result) {
      for(i in result){
          if(result[i].pickup_point == "" ) {
          } else{ 
                if(point_temp.includes(result[i].pickup_point) === false){
              point_temp.push(result[i].pickup_point)
          }
          }
      }
      for(x in point_temp){
          for(h in result){
              if(result[h].pickup_point == point_temp[x]){
                  seat_temp += result[h].seat_amount
                  ticket_id_temp += " " + result[h].ticket_id
              }
          }
          data.push({point:point_temp[x],amount_all:seat_temp,id:ticket_id_temp})
          seat_temp= 0 
          ticket_id_temp = ""
      }
      res.send(data)
  })
})


module.exports = router;
