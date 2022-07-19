const HDWalletProvider = require("truffle-hdwallet-provider-klaytn")

const NETWORK_ID = '1001'
const GASLIMIT = '8500000'

const URL = "https://api.baobab.klaytn.net:8651"
const PRIVATE_KEY = "0x1199093e175da0fe638c3f5d79e16bc61d8252687bc4bef6babeea7a6fb28999"

module.exports = {
  networks :{
    baobab : {
      provider : () => new HDWalletProvider(PRIVATE_KEY, URL),
      network_id : NETWORK_ID, 
      gas : GASLIMIT, 
      pasPrise : null
    }
  }
}