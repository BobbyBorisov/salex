/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
var HDWalletProvider = require("truffle-hdwallet-provider");


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    rinkeby: {
      provider: function() {
        return new HDWalletProvider("daring box glory poem math flip world public silly loan edge nice", "https://rinkeby.infura.io/1gI9DT8OOfMzWzoF21xH")
      },
      network_id: 3
    },
    development:{
      host:"127.0.0.1",
      port:8545,
      network_id:1
    },
    coverage:{
      host:"127.0.0.1",
      port:8555,
      gas: "0xfffffffffff",
      gasPrice: 0x01,
      network_id:"*"
    }
  }
};
