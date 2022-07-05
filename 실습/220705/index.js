const { response } = require("express")
var express = require("express")
var app = express()

//mysql2 라이브러리 로드
var mysql = require("mysql2")
//mysql 접속 정보 지정
var connection = mysql.createConnection({
    host : "localhost",
    port : 3306, 
    user : "root", 
    password : "1234",      //본인 sql 패스워드
    database : "blockchain" //본인이 만들어둔 데이터베이스의 이름
})




// 서버의 기본 세팅
app.set("views", __dirname + "/views")  //브라우져에 화면을 만들 파일들은 
                                        //__dirname(현재폴더) + "/views" 
                                        //현재폴더에서 하위폴더 views라는 폴더에 파일이 위치한다. 
app.set("view engine", "ejs")   //view 파일들을 ejs 엔진을 사용하여 오픈
                                // ejs: html태그 파일을 열어주는 엔진

app.use(express.json())    // json 형식의 데이터를 사용
app.use(express.urlencoded({extended: false})) 
// post 형식 데이터를 받을때 True 패키지 새로 설치
// false 형태일때는 추가 패키지 설치 필요 X

// api 구성
// api는 간단하게 음식점에 있는 메뉴판.
// 음식점 -> 손님 메뉴 선택 -> 해당하는 음식
// 주소 -> 손님 주소에 접속(요청) -> 해당하는 파일을 보내주는 형식

// localhost:3000/ 접속(요청) 시
app.get("/", function(req, res){    //req: request, res: response
    // res.send("Hello World")     //"Hello World" 응답 메시지로 보내주겠다.
    res.render("index.ejs")         // index.ejs 파일을 브라우져에 덮어준다.
                                    //index.ejs 파일의 위치는 현재폴더에서 하위폴더는 views 폴더에 존재
})

//localhost:3000/second 접속 시
app.get("/second", function(req, res){
    // res.send("Second Page")
    // index.ejs 데이터를 보낸 부분은 req 안에 존재
    // GET 형식에서는 req.query 데이터가 존재
    console.log(req.query)
    console.log(req.query.id)
    console.log(req.query.pass)
    // id 값이 test이고 password값이 1234인 경우 로그인 성공
    // second.ejs 보여준다.
    // 둘중에 하나라도 값이 다르다면 index 페이지로 돌아간다. 
    // 조건이 참이면 실행할 
    // 코드 거짓이면 실행할 코드 
    if (req.query.id == "test" && req.query.pass == "1234"){
        res.render("second.ejs")    //if문의 두 조건이 모두 참이면
    }else{                          
        // 조건 중 하나라도 거짓이거나 모두 거짓이면 인덱스 페이지 돌아간다.
        res.redirect("/")           //설정된 주소로 이동 -> localhost:3000 이동
    }
    // res.render("second.ejs")    //second.ejs 파일을 브라우져에 덮어준다.
})

//localhost:3000/signup 주소로 요청을 보내면 signup.ejs 보여주겠다.
app.get("/signup", function(req, res){
    res.render("signup.ejs")
})

// DB에 회원 정보 등록 
app.post("/signup2", function(req, res){
    //signup 페이지에서 데이터를 2개를 send
    // 두 데이터의 값을 변수로 지정. 
    // DB insert()
    //  {id : input id 입력값, pass : input password 입력값}
    var input_id = req.body.id
    var input_pass = req.body.pass
    console.log(input_id)
    console.log(input_pass)
    connection.query(
        `insert into user_info(user_id, user_pass) values (?, ?)`,
        [input_id, input_pass], 
        function(err, result){
            if(err){
                console.log(err)
                res.send("SQL Error")
            }else{
                // 회원가입이 완료 후 로그인 페이지 이동
                res.redirect("/")
            }
        }
    )
})

//회원 정보 수정 페이지로 이동 api 생성
app.get("/update", function(req, res){
    res.render("update.ejs")
})

//회원 정보 수정 
//조건 : 아이디값이 같은 데이터의 password를 변경
//id와 password 두 데이터를 유저에게서 받아오는 작업
// 1. api 생성
// 2. 유저가 보내온 데이터를 변수에 지정
// 3. sql 쿼리문을 이용하여 데이터를 수정
// 4. index.ejs 로 돌아간다.
app.post("/update2", function(req, res){
    var input_id = req.body.id
    var input_pass = req.body.pass
    console.log(input_id)
    console.log(input_pass)
    connection.query(
        `update user_info set user_pass = ? where user_id = ?`,
        [input_pass, input_id],
        function(err){
            if(err){
                console.log(err)
                res.send("sql Error")
            }else{
                // redirect 해당하는 주소로 이동
                res.redirect("/")
            }
        }
    )
})


app.post("/login", function(req, res){
    //post형식에서는 데이터를 body 실어서 보낸다.
    var input_id = req.body.id
    var input_password = req.body.pass
    // input 데이터를 sql 담아서 쿼리문 실행 결과값 리턴
    connection.query(
        `select * from user_info where user_id= ? and user_pass = ?`,
        [input_id, input_password],
        function(err, result){
            if(err){        //sql이 에러가 났을 때
                console.log(err)
                res.send("sql error")
            }else{
                if(result.length > 0){  //id와 password의 조건이 둘다 참이므로
                                        //데이터가 존재하는 경우 (로그인 성공)
                    console.log(result)
                    res.render("second.ejs")
                }else{                  //로그인이 실패
                    console.log(result)
                    res.redirect("/")
                }
            }
        }
    )
})

//회원 탈퇴 
//회원 탈퇴 페이지 이동 api 생성
app.get("/delete", function(req,res){
    res.render("delete.ejs")
})

//회원 탈퇴 
//1. delete.ejs id 값을 받아오고
//2. sql 쿼리문 데이터를 삭제
//3. index.ejs 다시 이동
app.post("/delete2", function(req, res){
    var input_id = req.body.id
    connection.query(
        `delete from user_info where user_id = ?`,
        [input_id],
        function(err){
            if(err){
                console.log(err)
                res.send("sql Error")
            }else{
                res.redirect("/")
            }
        }
    )
})



app.post("/third", function(req, res){
    console.log(req.body)                   //POST 형식 통신 데이터는 body 부분 담겨서 보내준다. 
    //get 형식은 url에 데이터를 담아서 보내고 POST형식은 body 숨겨서 데이터를 보낸다.
    var input_name = req.body.user_name     //body안에 user_name키 값이 가지고 있는 value 값을 변수에 삽입
    var input_phone = req.body.user_phone   //body안에 user_phone 키값이 가지고 있는 value 값을 변수에 삽입 
    console.log(input_name, input_phone)    //변수에 데이터가 잘 들어갔는지 확인
    res.render('third.ejs', 
        {
            name : input_name, 
            phone : input_phone
        }
    )                 // third.ejs 파일을 랜더링
})

var port = 3000
app.listen(port, function(){
    console.log("서버 시작")
})