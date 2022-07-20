require('dotenv').config()
//mysql 설정
var mysql = require("mysql2")
var connection = mysql.createConnection({
    host : process.env.host,
    port : process.env.port, 
    user : process.env.user, 
    password : process.env.password, 
    database : process.env.database
})

connection.query(
    `CREATE TABLE user_list (
        ID VARCHAR(32) NOT NULL,
        password VARCHAR(45) NOT NULL,
        wallet TEXT NOT NULL,
        PRIMARY KEY (ID));
    `, 
    function(err){
        if(err){
            console.log("user_list create error :",err)
        }else{
            console.log("user_list table 생성 완료")
        }
    }
)

connection.query(
    `CREATE TABLE car_list (
        num VARCHAR(32) NOT NULL,
        year INT NOT NULL,
        type VARCHAR(32) NOT NULL,
        check_date VARCHAR(45) NULL,
        PRIMARY KEY (num));
      `,
      function(err){
        if(err){
            console.log("car_list create error :", err)
        }else{
            console.log("car_list table 생성 완료")
        }
      }
)