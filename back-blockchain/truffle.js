//const HDWalletProvider = require("truffle-hdwallet-provider");
//require('dotenv').config()  // Store environment-specific variable from '.env' to process.env



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

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

    networks: {
      development: {
        host: "127.0.0.1",
        port: 8545,
        network_id: "*" // Match any network id
      },
      rinkeby: {
//        provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY),
        host: "127.0.0.1", // Connect to geth on the specified
        port: 8545,
        from: "0xbdb94645417aaffede5ee56f4d8f1d8449af0a5d", // default address to use for any transaction Truffle makes during migrations
        network_id: 4,
        gasPrice: 200,
        gas: 4612388  // Gas limit used for deploys
      }
    }
  
};
