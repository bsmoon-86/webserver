var express = require("express")    //express 모듈을 로드
var app = express()     //express 모듈안에 있는 express class 불러오는 과정

//__dirname : index.js파일이 있는 위치
//+"/views" : 하위폴더 views으로 이동
//보여줄 page(html)들의 위치를 지정
app.set("views", __dirname+"/views");  
//보여줄 페이지들을 엔진을 어떤 것을 사용하여 보여줄지 지정
//ejs엔진은 html 구동할때 사용하는 엔진 중 하나
//html 엔진도 존재. 세팅하는 법 복잡. 그래서 ejs 대체 사용
app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({extended:false}))



//웹 서버가 시작 -> api를 생성
//통신방식 get, post 지정

app.get("/", function(req, res){    //localhost:3000/ 로 호출했을때
    res.render("index.ejs")
})

app.get("/second", function(req, res){  //localhost:3000/second 로 호출했을때
    /*
        list 형태의 데이터
        list = [10, 20, 30]
        10을 출력하려면? -> list[0]
        웹상에 데이터는 json형태로 메시지 주고 받는다. 
        message = {
            ID : id, 
            password : PASSWORD
        }
        id을 출력하려면? -> message.ID
    */
   //get형태로 데이터를 보내줄때는 데이터의 위치가
   // req.query -> json형태
   // 입력한 ID값은 req.query.ID
   // 입력한 password값은 req,query.password
    console.log("query : ", req.query)
    console.log("ID : ", req.query.ID)
    console.log("password : ", req.query.password)
    // id : test, password : 1234 로그인 성공
    // 로그인이 성공하면 Second Page 출력
    // 로그인이 실패하면 Login fail 출력
    if(req.query.ID == "test" && req.query.password == "1234"){
        res.send("Second Page")
    }else{
        res.send("Login fail")
    }
})

app.post("/third", function(req, res){
    console.log("body : ", req.body)
    console.log("NAME : ", req.body.name)
    res.send("Third Page")
})




var port = 3000
app.listen(port, function(){    //웹서버가 실행이 됬을때 웹서버 시작 콘솔에 프린트
    console.log("웹 서버 시작")
})