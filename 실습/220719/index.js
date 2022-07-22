var express = require("express")
var app = express()
require('dotenv').config()
var moment = require("moment")

var session = require('express-session')
app.use(
    session({
        secret : process.env.session,
        resave: false, 
        saveUninitialized: true, 
        maxAge : 36000000
    })
)

app.set("views", __dirname+"/views")
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname+"/public"))

//kalytn 설정

var CaverExtKAS = require("caver-js-ext-kas")
var caver = new CaverExtKAS()

var keyringContainer = new caver.keyringContainer()
var keyring = keyringContainer.keyring.createFromPrivateKey("0x1199093e175da0fe638c3f5d79e16bc61d8252687bc4bef6babeea7a6fb28999")
keyringContainer.add(keyring)

var accesskey = "KASKXIG9F5NW9CKZ0441FYCF"
var secretaccesskey = "8iln9cyYDLUwGuR3IoRLC0w0ZZjW5WEvxxBVBIOM"
var chainId = 1001 //test net  , 8217번이 메인넷
caver.initKASAPI(chainId, accesskey, secretaccesskey) // KAS 초기화
var kip7 = new caver.kct.kip7("0xDA76fc2859DC573F551f2df5ff400B9A13a8DCcA")
kip7.setWallet(keyringContainer)    //kip7 내의 wallet 설정
//kalytn 설정 끝

// 송금 함수
async function token_trans(address, token){
    var receipt = await kip7.transfer(address, token, { 
        from : keyring.address 
    })
    return receipt
}

//조회 함수
async function balanceOf(address){
    var receipt = await kip7.balanceOf(address, { 
        from : keyring.address
    })
    return receipt
}

//klaytn contract 연결
var Caver = require("caver-js")
var cav = new Caver("https://api.baobab.klaytn.net:8651")
var product_contract = require("./build/contracts/safe.json")
var smartcontract = new cav.klay.Contract(product_contract.abi, product_contract.networks["1001"].address)
var account = cav.klay.accounts.createWithAccountKey(process.env.address, process.env.privatekey)
cav.klay.accounts.wallet.add(account)

//mysql 세팅
var mysql = require('mysql2')
var connection = mysql.createConnection({
    host : process.env.host, 
    port : process.env.port,
    user : process.env.user, 
    password : process.env.password, 
    database : process.env.database
})


app.get("/", function(req, res){
    res.render("main.ejs")
})

app.get("/main", function(req, res){
    if(!req.session.login){
        res.redirect("/")
    }else{
        res.render("index.ejs")
    }
})

app.post("/signin", function(req, res){
    var id = req.body._id
    var pass = req.body._pass
    console.log(id, pass)
    connection.query(
        `select * from user_list where ID = ? AND password = ?`,
        [id, pass], 
        function(err, result){
            if(err){
                console.log(err)
                res.send("select error")
            }else{
                if(result.length > 0){      //로그인 성공
                    req.session.login = result[0]
                    res.redirect("/main")
                }else{
                    res.redirect("/")
                }
            }
        }
    )
})

app.get("/signup", function(req, res){
    res.render("signup.ejs")
})

app.post("/signup2", function(req, res){
    var id = req.body._id
    var pass = req.body._pass
    var wallet = req.body._wallet
    console.log(id, pass, wallet)
    // mysql data insert
    connection.query(
        `insert into user_list values (?,?,?)`,
        [id, pass, wallet],
        function(err){
            if(err){
                console.log(err)
                res.send("signup insert error")
            }else{
                res.redirect("/")
            }
        }
    )
})

app.get("/add_car", function(req, res){
    if(!req.session.login){
        res.redirect("/")
    }else{
        res.render("add_car.ejs")
    }
})

app.post("/add_car2", function(req, res){
    var num = req.body._num
    var year = req.body._year
    var type = req.body._type
    console.log(num, year, type)
    // mysql insert
    connection.query(
        `insert into car_list(num, year, type) values (?,?,?)`,
        [num, year, type], 
        function(err){
            if(err){
                console.log(err)
                res.send("add_car insert error")
            }else{
                res.redirect("/main")
            }
        }
    )
})

app.get("/list", function(req, res){
    if(!req.session.login){
        res.redirect("/")
    }else{
        connection.query(
            `select * from car_list`, 
            function(err, result){
                if(err){
                    console.log(err)
                    res.send("list select error")
                }else{
                    res.render("car_list.ejs", {
                        list : result
                    })
                }
            }
        )
    }
})

app.get("/check", function(req, res){
    if(!req.session.login){
        res.redirect("/")
    }else{
        var num = req.query._num
        res.render("check.ejs", {
            num : num
        })
    }
})

app.post("/check2", function(req, res){
    /* contract에서 add_check()함수에 매개변수 -> 로그인을 한 사람의 지갑 주소, 차량 번호, 점검 결과, 현재 시간
    check1,2,3 -> 점검 결과
    로그인 한 사람의 지갑 주소 -> req.session.login.wallet
    차량 번호 -> 페이지에서 받아올 것
    현재 시간 -> 라이브러리? "moment" 
    */
    var num = req.body._num
    var check1 = req.body.check1
    var check2 = req.body.check2
    var check3 = req.body.check3
    var checks = check1 + check2 + check3
    var checker = req.session.login.wallet
    var check_date = moment().format("YYYY/MM/DD HH:mm:ss")
    console.log(check1, check2, check3)
    if(!req.session.login){
        res.redirect("/")
    }else{
        smartcontract.methods
        .add_check(checker, num, checks, check_date)
        .send({
            from : account.address,
            gas : 2000000,
        })
        .then(function(receipt){
            console.log(receipt)
            res.redirect("/reward")
        })
    }
})

app.get("/reward", function(req, res){
    var address = req.session.login.wallet
    var reward = 10
    token_trans(address, reward).then(function(receipt){
        console.log(receipt)
        res.redirect("/main")
    })
})

app.get("/trans", function(req, res){
    res.render("trans.ejs")
})

app.post("/trans2", function(req, res){
    var address = req.body._address
    var token = req.body._token
    token_trans(address, token).then(function(receipt){
        console.log(receipt)
        res.redirect("/trans")
    })
})

app.get("/balance", function(req, res){
    var address = "0xC2db99aB429d57efad30c06Cf9c09e11a0A076EA"
    balanceOf(address).then(function(result){
        console.log(result)
        res.send(result)
    })
})

app.get("/check_list", function(req, res){
    if(!req.session.login){
        res.redirect("/")
    }else{
        connection.query(
            `select * from car_list`,
            function(err, result){
                if(err){
                    console.log(err)
                    res.send("check_list select error")
                }else{
                    res.render("car_list_m.ejs", {
                        list: result
                    })
                }
            }
        )
    }
})

app.get("/check_info", function(req, res){
    if(!req.session.login){
        res.redirect("/")
    }else{
        var num = req.query._num
        smartcontract.methods
        .get_list(num)
        .call()
        .then(function(receipt){
            console.log(receipt)
            res.render("check_info.ejs", {
                result : receipt,
                num : num
            })
        })
    }
})

app.get("/check_info2", function(req, res){
    if(!req.session.login){
        res.redirect("/")
    }else{
        var num = req.query._num
        var check_array = new Array();
        smartcontract.methods
        .total_count()
        .call()
        .then(function(count){
            for(var i =0; i < count;i++){
                smartcontract.methods
                .get_checks(i)
                .call()
                .then(function(receipt){
                    if(receipt[1] == num){
                        check_array.push(receipt)
                    }
                })
            }
        })
        setTimeout(() => {
            console.log(check_array)
            res.render("check_list2.ejs", {
                list : check_array
            })
        }, 2000)
        
    }
})


//api통해서 지갑을 생성
app.get("/get_wallet", function(req, res){
    account = async() => {
        res.json(await caver.kas.wallet.createAccount())
    }
    account()
})

var port = 3000
app.listen(port, function(){
    console.log("서버 시작")
})