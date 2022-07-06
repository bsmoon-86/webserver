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

// login.ejs에서 ID, Password 값을 보내줬을때 api인
// post 형태의 /login api 생성
app.post("/login", function(req, res){
    //login.ejs 보내준 데이터를 변수 지정
    //변수의 데이터들을 mysql user_info 테이블에 값이 존재하는지 확인
    //값이 존재하면 로그인 성공
    //값이 존재하지 않으면 로그인 실패
    //{_id : value, _pass : value2}
    var input_id = req.body._id
    var input_pass = req.body._pass
    console.log(input_id, input_pass)
    //mysql 데이터와 조회
    connection.query(
        `select * from user_info where user_id = ? and user_pass = ?`,
        [input_id, input_pass],
        function(err, result){
            if(err){
                console.log(err)
                res.send("SQL Error")
            }else{
                console.log(result)
                if(result.length > 0){  //데이터가 존재하는 경우
                    res.send("로그인 성공")
                }else{
                    res.send("로그인 실패")
                }
            }
        }
    )



})
