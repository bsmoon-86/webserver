var express = require("express")
var app = express()

app.set("views", __dirname+"/views")
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended:false}))

//kalytn 설정
var Caver = require("caver-js")
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




app.get("/", function(req, res){
    res.render("main.ejs")
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
    res.send(id, pass, wallet)
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