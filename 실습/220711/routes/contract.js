var express = require("express")
var router = express.Router()

//smartcontract와 연동(ganache)
var Web3 = require("web3")
var product_contract = require("../contracts/test")
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
var smartcontract = new web3.eth.Contract(
    product_contract.abi, 
    product_contract.address
)

// 계약서 등록 페이지 이동
router.get("/", function(req, res){
    res.render("add2.ejs")
})

router.post("/add", function(req, res){
    var no = req.body._no
    var content = req.body._content
    console.log(no, content)
    //가나슈에 있는 지갑 주소 중 첫번째 주소를 가지고오는 부분
    web3.eth.getAccounts(function(err, ass){    //ass : 주소 리스트
        if(err){
            console.log(err)
            res.send("getAccounts error")
        }else{
            //주소의 첫번째 항목 ass[0]
            console.log(ass)
            var address = ass[0]

            //smartcontract에 있는 함수를 호출
            smartcontract.methods
                .add_contract(no, content, "220713")
                .send({
                    from : address,
                    gas : 2000000
                })
                .then(function(receipt){
                    console.log(receipt)
                    res.send(receipt)
                })
        }
    })
})

router.get("/sign", function(req, res){
    var n = 0
    var no = "a1"
    // n 이 0이라면 갑의 서명(가나슈 첫번째 주소)
    // n 이 1이라면 을의 서명(가나슈 두번째 주소)
    if(n == 0){
        web3.eth.getAccounts(function(err, ass){
            if(err){
                console.log(err)
                res.send("getAccounts error")
            }else{
                var address = ass[0]
                smartcontract.methods
                    .a_sign(no)
                    .send({
                        from : address,
                        gas : 2000000
                    })
                    .then(function(receipt){
                        res.send(receipt)
                    })
            }
        })
    }
})

router.get("/info", function(req, res){
    var no = "a1"
    smartcontract.methods
        .view_contract(no)
        .call()
        .then(function(result){
            res.send(result)
        })
})


module.exports = router