var express = require('express')
var router = express.Router()


//api 구성
//localhost:3000/contract 기본 url
router.get("/", function(req, res){
    if(req.session.login){
        res.render("main.ejs")
    }else{
        res.redirect("/login")
    }
})





//index.js 에서 사용을 할수 있게 설정
module.exports = router