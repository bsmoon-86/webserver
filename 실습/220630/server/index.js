var express = require("express")    //express 모듈을 로드
var app = express()     //express 모듈안에 있는 express class 불러오는 과정

//웹 서버가 시작 -> api를 생성
//통신방식 get, post 지정

app.get("/", function(req, res){    //localhost:3000/ 로 호출했을때
    res.send("Hello World!")
})

app.get("/second", function(req, res){  //localhost:3000/second 로 호출했을때
    res.send("Second Page")
})





var port = 3000
app.listen(port, function(){    //웹서버가 실행이 됬을때 웹서버 시작 콘솔에 프린트
    console.log("웹 서버 시작")
})