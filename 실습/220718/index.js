var express = require("express")
var app = express()

var mysql = require("mysql2")
var connection = mysql.createConnection({
    host : "localhost", 
    port : 3306, 
    user : 'root', 
    password : "1234",
    database : "blockchain"
})

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('views', __dirname+"/views")
app.set('view engine', 'ejs')

app.get("/", function(req, res){
    res.render("main.ejs")
})

app.get("/ajax", function(req, res){
    var name = req.query._name
    var phone = req.query._phone
    console.log(name, phone)
    res.json({
        a : "Ajax 요청 성공"
    })
})

app.post("/ajax_post", function(req, res){
    var name = req.body._name
    var phone = req.body._phone
    console.log(name, phone)
    res.json({
        a:"Post 비동기 통신 완료"
    })
})

app.get("/ajax_getjson", function(req, res){
    var name = req.query._name
    console.log(name)
    res.json({
        a : "getJSON 성공"
    })
})

app.get("/signup", function(req, res){
    res.render("signup.ejs")
})

app.get("/check_id", function(req, res){
    // id 값을 받아와서 sql에 있는 user table에서 id값이 존재하는지 
    var id = req.query._id
    console.log(id)
    connection.query(
        `select * from user where ID = ?`,
        [id],
        function(err, result){
            if(err){
                console.log(err)
                res.send("SQL Error")
            }else{
                if(result.length == 0){
                    res.send("success")
                }else{
                    res.send("fail")
                }
            }
        }
    )
})

var port = 3000
app.listen(port, function(){
    console.log("서버 시작")
})