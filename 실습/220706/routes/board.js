const { application } = require("express")
var express = require("express")
var router = express.Router()

var mysql = require("mysql2")
var connection = mysql.createConnection({
    host : "localhost", 
    port : 3306, 
    user : "root", 
    password : "1234", 
    database : "blockchain"
})

//localhost:3000/board 접속 시
router.get("/", function(req, res){
    connection.query(
        `select * from board`,
        function(err, result){
            if(err){
                console.log(err)
                res.send("SQL Error")
            }else{
                console.log(result)
                res.render("main.ejs", {content : result})
            }
        }
    )
    // res.render("main.ejs")
})

// 글 쓰기 api는 /board/add
// board.js 자체는 /board 호출이 되야 오픈이 되는 파일
router.get("/add", function(req, res){
    res.render("write.ejs")
})

//글을 DB 등록 api
router.get("/writing", function(req, res){
    // write.ejs에서 데이터를 3개를 보내준다.
    // 보내준 데이터의 변수 지정
    // board table -> insert 
    var input_title = req.query._title
    var input_contents = req.query._contents
    var input_writer = req.query._writer
    console.log(input_title, input_contents, input_writer)
    // 데이터베이스에 insert 
    connection.query(
        `insert into board(title, contents, writer) values (?,?,?)`,
        [input_title, input_contents, input_writer],
        function(err){
            if(err){
                console.log(err)
                res.send("SQL Error")
            }else{
                res.redirect("/board")
            }
        }
    )
})

// cannot GET /board/info
// localhost:3000/board/info?_no=글번호
router.get("/info", function(req, res){
    //글번호 변수 지정
    var no = req.query._no
    console.log(no)
    // 글번호를 받아온 뒤 해야되는 작업?
    // DB 해당 글 번호의 정보를 로드 
    connection.query(
        `select * from board where No = ?`,
        [no],
        function(err, result){
            if(err){
                console.log(err)
                res.send("SQL Error")
            }else{
                console.log(result)
                res.render("info.ejs", {info : result})
            }
        }
    )
})

module.exports = router