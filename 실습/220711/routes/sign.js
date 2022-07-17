var express = require('express')
var router = express.Router()
var moment = require("moment")

var mysql = require("mysql2")
var connection = mysql.createConnection({
    host : process.env.host,
    port : process.env.port, 
    user : process.env.user, 
    password : process.env.password, 
    database : process.env.database
})

//api 구성
//localhost:3000/contract 기본 url
router.get("/", function(req, res){
    if(req.session.login){
        var id = req.session.login.ID
        connection.query(
            `select No, a_id, b_id, a, b from contract 
            where a_id =? or b_id= ?`,
            [id, id],
            function(err, result){
                if(err){
                    console.log(err)
                    res.send("SQL select error")
                }else{
                    console.log(result)
                    res.render("main.ejs", {
                        contents : result
                    })
                }
            }
        )
        // res.render("main.ejs")
    }else{
        res.redirect("/login")
    }
})

//1. 계약서 내용 전체를 넣는 방법(textarea 전체 내용 기입, 파일 업로드)
//2. 특정 항목들만 넣는 방법(input 다중)
router.get("/add", function(req, res){
    if(req.session.login){
        res.render("add.ejs")
    }else{
        res.redirect("/login")
    }
})

router.post("/add2", function(req, res){
    var no = req.body._no
    var content = req.body._content
    var b_id = req.body._b_id
    var time = moment().format('YYYY/MM/DD hh:mm:ss')
    var a_id = req.session.login.ID
    console.log(no, content, a_id, b_id, time)
    // 문서번호, 계약 내용, 작성 시간, 갑의 사인(0), 을의 사인(0),
    // 갑의 아이디, 을의 아이디
    connection.query(
        `insert into contract values (?,?,?,?,?,?,?)`,
        [no, content, time, 0, 0, a_id, b_id],
        function(err){
            if(err){
                console.log(err)
                res.send("SQL insert error")
            }else{
                res.redirect("/contract")
            }
        }
    )
})

//단일 계약서 상세 정보 출력 url
router.get("/info", function(req, res){
    if(req.session.login){
        var no = req.query._no
        connection.query(
            `select * from contract where No = ?`,
            [no],
            function(err, result){
                if(err){
                    console.log(err)
                    res.send("SQL select error")
                }else{
                    // result.length --> 1 기본키를 기준으로 조회
                    // result형태는 리스트
                    // result[0] 형태 : json
                    res.render("info.ejs", {
                        content : result[0],
                        login_id : req.session.login.ID
                    })
                }
            }
        )
    }else{
        res.redirect("/login")
    }
})

router.get("/sign", function(req, res){
    if(req.session.login){
        var sql
        var no = req.query._no
        var n = req.query._n
        console.log(no, n)
        // n이 0이면 갑 -> 해당하는 데이터의 a필드의 값을 0에서 1로 변경
        // n이 1이면 을 -> 해당하는 데이터의 b필드의 값을 0에서 1로 변경
        // update 쿼리문을 이용하여 데이터를 변경하고
        // 변경이 완료되면 /contract url로 이동
        if(n == 0){
            sql = `update contract set a = 1 where No = ?`
        }else{
            sql = `update contract set b = 1 where No = ?`
        }
        connection.query(
            sql,
            [no],
            function(err){
                if(err){
                    console.log(err)
                    res.send("SQL update error")
                }else{
                    res.redirect("/contract")
                }
            }
        )
    }else{
        res.redirect("/login")
    }
})


//index.js 에서 사용을 할수 있게 설정
module.exports = router