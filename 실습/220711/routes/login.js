var express = require("express")
var router = express.Router()

//mysql 설정(데이터베이스에서 접속 설정)
var mysql = require("mysql2")
var connection = mysql.createConnection({
    host : 'localhost',
    port : 3306, 
    user : 'root', 
    password : '1234', 
    database : "blockchain"
})

//api 구성
// localhost:3000/login이 기본 url
// '/' 로그인 화면
// '/signup' 회원 가입
// '/signin' 데이터베이스와 확인하여 로그인 유무 세션 저장
// '/delete' 회원 탈퇴(시간이 되면)
// '/update' 회원 정보 수정(시간이 되면)

router.get("/", function(req, res){
    if(req.session.login){
        res.redirect("/contract")
    }else{
        res.render("login.ejs")
    }
})

router.post("/signin", function(req, res){
    var id = req.body._id
    var pass = req.body._pass
    console.log(id, pass)   //데이터가 잘 들어왔는지 확인
    connection.query(
        `select * from user where ID = ? and password = ?`,
        [id, pass],
        function(err, result){
            // result는 데이터타입 -> list
            // result [{},{},{}]
            // result[0]의 데이타입 -> json
            if(err){
                console.log(err)
                res.send("SQL select error")
            }else{
                if(result.length > 0 ){             //로그인 성공
                    req.session.login = result[0]
                    res.redirect("/contract")
                }else{                              //로그인 실패
                    res.redirect("/login")
                }
            }
        }
    )
})

//회원 가입 페이지 렌더
router.get("/signup", function(req, res){
    res.render("signup.ejs")
})

//회원 정보 데이터베이스에 insert
router.post("/signup2", function(req, res){
    var id = req.body._id
    var pass = req.body._pass
    var name = req.body._name
    var birth = req.body._birth
    var phone = req.body._phone
    //id값에 대한 중복 여부.
    // 중복 데이터가 존재하지 않으면 insert 
    // 중복 데이터가 존재하면 message(아이디 값이 존재한다.)
    connection.query(
        `select * from user where ID = ?`,
        [id],
        function(err, result){
            if(err){
                console.log(err)
                res.send("SQL select error")
            }else{
                if(result.length == 0){
                    connection.query(
                        `insert into user values (?,?,?,?,?)`,
                        [id, pass, name, birth, phone],
                        function(err2){
                            if(err2){
                                console.log(err2)
                                res.send("SQL insert error")
                            }else{
                                res.redirect("/login")
                            }
                        }
                    )
                }else{
                    res.send("아이디가 존재합니다")
                }
            }
        }
    )
})

//로그 아웃
router.get("/logout", function(req, res){
    if(req.session.login){
        req.session.destroy(
            function(err){
                if(err){
                    console.log(err)
                }else{
                    res.redirect("/login")
                }
            }
        )
    }else{
        res.redirect("/login")
    }
})




module.exports = router