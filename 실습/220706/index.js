// express 라이브러리 로드 후 클래스 생성
var express = require("express")
var app = express()

//mysql 접속 정보 등록
var mysql = require("mysql2")
var connection = mysql.createConnection({
    host : "localhost", 
    port : 3306, 
    user : "root", 
    password : "1234",
    database : "blockchain"
})

// express server 기본 세팅
app.set("views", __dirname+"/views")    
// 랜더링할 페이지들은 현대 디렉토리에서 /views라는 폴더에 저장되어있다.
app.set("view engine", "ejs")
// 랜더링할 페이지들을 ejs 엔진을 이용하여 랜더링 작업을 하겠다.

// post 통신 방식에서 데이터를 받아오기 위한 세팅 
app.use(express.json())
app.use(express.urlencoded({extended:false}))

var port = 3000
app.listen(port, function(){
    console.log("서버 시작")
})

//localhost:3000 접속 시 login.ejs 랜더링
app.get("/", function(req, res){
    res.render("login.ejs")
})

//route 작업
//회원 관리에 대한 user.js 파일을 새로 만들어서 해당 api 이동
// index.js에서 user.js파일 로드

//routes 폴더에 안에 있는 user.js 파일을 불러온다.
var user = require("./routes/user")
//localhost:3000/login이라는 주소로 접속 시 user.js파일을 사용한다. 
app.use("/login", user)

// 게시판의 기능은 board.js에 코드 작성
// /board 라는 주소로 접속 시 board.js 사용
var board = require("./routes/board")
app.use("/board", board)