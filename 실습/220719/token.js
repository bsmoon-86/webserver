var CaverExtKAS = require('caver-js-ext-kas')
var caver = new CaverExtKAS()

var accesskey = "KASKXIG9F5NW9CKZ0441FYCF"
var secretaccesskey = "8iln9cyYDLUwGuR3IoRLC0w0ZZjW5WEvxxBVBIOM"
var chainId = 1001 //test net  , 8217번이 메인넷
caver.initKASAPI(chainId, accesskey, secretaccesskey) // KAS 초기화

var keyringContainer = new caver.keyringContainer()
var keyring = keyringContainer.keyring.createFromPrivateKey("0x1199093e175da0fe638c3f5d79e16bc61d8252687bc4bef6babeea7a6fb28999")
keyringContainer.add(keyring)   //새로운 월렛 추가(KAS 지갑주소가 아닌 외부의 지갑 주소를 등록)

async function create_token(){
    var kip7 = await caver.kct.kip7.deploy({
        name : 'ourmemory2',    //토큰의 이름
        symbol: 'OM2',          //토큰의 심볼
        decimals : 0,           //토큰 소수점자리
        initialSupply : 1000000 //토큰 발행량
    }, keyring.address, keyringContainer)
    console.log(kip7._address)
}
create_token()

