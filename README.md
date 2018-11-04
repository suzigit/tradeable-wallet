Have you already buy & sell tokens? What about buy&sell your wallet with all you have within?
How can we do that in a TRUSTLESS way? This project  - Tradeable Wallet - is the solution to that.

Why it is useful?
-----------------
This project was created with a specific scenario in mind. Imagine you have bought some tokens during an ICO. You registered your address in the SAFT contract (or, in a Pool e.g. Primablock). But now you have to wait some days or even months before receive your tokens. If you had used the Tradeable Wallet (created by this project) you can sell your tokens EVEN BEFORE receive them. It works in a TRUSTLESS WAY, i.e., the peers do not need to trust each other in order to do trading.
The magic is: The tradeable wallet is a Ethereum Smart Contract. The tokens (from the ICO) are going to be send to the address of your Tradeable Wallet. The Smart Contract has functions to sell/buy. At any time, the owner of the wallet can also withdraw the received tokens.


User Stories:
-------------
As an ICO investor, I can open the web app using Metamask. The GUI recognizes the selected Ethereum address and show me a set of possibilities. I can create a new Tradeable Wallet and see its Ethereum address.

I can use its address to indicate where I am going to receive my future tokens. Then, I can put my wallet for sale. Or wait and, after receive my tokens, withdraw them, e.g., transfer them from my Tradeable Wallet to my personal Ethereum address.

I can also buy Tradeable Wallets created by other ICO investors. The trade is perfomed in a TRUSTLESS way.
At any time, I can see information related to my Tradeable Wallets, like all withdraws and past owners.


See the App
-----------

You can access the app at: https://tradeable-wallet.herokuapp.com/
You have to use Metamask and be connected on Rinkeby. 

You start by creating a new Tradeable Wallet. Take note of its address in order to use the next functionalities. Or use ENS to create a namehash to it. I suggest you to use this link to create a namehash on Rinkeby: https://michalzalecki.com/register-test-domain-with-ens/.
You can also test with my ENS - **suziwallet**. If you create a namehash to your wallet, you can use it in the next functionalities, by clicking in ENS.

Then, you can use sell/buy. Since you are the owner of the wallet, you can sell it. Besides informing its price, you can also add up a description - why someone should buy your wallet. You can explain what tokens this wallet is register to receive, for example. This description will be stored on IPFS and the hash of the IPFS information will be registered in your Tradeable Wallet. 
When buying more wallets, you should change the account in metamask in order to simulate multiple users. This new acccount must have enough ether to pay the price of the wallet. Test and see the trade happening!
You can do as many sell/buy as you want. You can also see all owners in the lifecycle of your Tradeable-Wallet.

There is a problem to test the withdraw functionality. You Tradeable Wallet address must have tokens in a ERC-20 contract! So, you have the following options:
a) You can test doing withdraw of 0 tokens and the ERC-20 address specified at deployed_addresses.txt 
b) You can deploy a new instance of _TokenERC20_Mock_ (provided in this project) on Rinkeby using your account X. Since X is going to receive ERC-20 tokens, you can transfer some of them to the address of your Tradeable Wallet using _TokenERC20_Mock_ functions. Then, you can test withdraw functionality of this project.
c) Send me a message with your Tradeable Wallet on Rinkeby and I send you some ERC-20 tokens to test.

You can also see all historic withdraws of your Tradeable Wallet. 

Note that I there are more functions in Smart Contract than there are function been used by the front-end. That is because this project will continue after this course.  


How to set it up
----------------

This is the official repository: https://github.com/suzigit/tradeable-wallet.git 

There are two folders at the first level of the source code: front (Angular 4 + web3 1.0) and back-blockchain.

If you want to set it up locally, you must first set your environment. If you still do not have, install truffle, ganache and metamask.

Use truffle development configuration (see truffle.js) to run the contract on localhost at 8545. Configure Metamask to the same network, assuring you have ether in your accounts. When migrating the contracts, take note of the address of ContractCreator and TokenERC0_Mock.

In order to run the front end you first need to configure your contract address at src/app/constansts.json. Change the variables considering what you got during migration. You are going to need TokenERC0_Mock addr to test the withdraw functionality.

To run Angular, you need to generate the node_modules do npm install inside the folder called front. 
Then, use: 
- npm start to generate all compiled front files and serve it at localhost:8080 or   
- install angular cli (npm install -g @angular/cli) and load in development mode using "ng serve". See the app at localhost:4200.

See information about how to set up a Dapp with Angular front-end at: https://truffleframework.com/boxes/angular-truffle-box.


Unit tests
----------

There are two set of tests - one to each smart contract. Note that there are no tests to contracts developed with mocking purposes.

**Tradeable Wallet tests** 
The most important issues are the 3 main functinalities - withdraw, sell and buy. The tests cover:
- owner is who is supposed to be (in order to check the initial setup)
- only the contract owner can withdraw tokens (two tests to assure this)
- the contract owner can put his wallet(=tradeable wallet) for sale
- any user can buy a wallet if and only if the owner put this wallet for sale and this user provide enough money. (three tests to assure this)

**Contract Creator tests**
The most important issues to test are ownership, contract creation and circuit breaker. The tests cover:
- owner is who is supposed to be (in order to check the initial setup)
- any user can create new Tradeable Wallets and its creation is reflected in view functions (getContractCount, getContracts) 
- it is possible to turn circuir breaker on, avoiding the creation of new Tradeable Wallets. It is also possible to set circuit breaker off and create new tokens again.



Technical Highlights
---------------------

The front-end is using **Web3.0 1.0**! Exciting projects use new tech! :wink:

The project uses different ways of smart contract external calls, emit/watch events and filter some of them in the GUI. 

Two links in the front-end are not developed yet. If you click you is going to see a rational about how they could be implemented, possibly using an external storage.

The solution is integrated with the following existing services. 

a) **ENS (Ethereum Name Service)**- You can search your wallet using ethereum address or namehash of ENS.

b) **IPFS** - You can file information on IPFS and link its hash inside your smart contract.


It could be interesting to have an oracle service of personal reputation in the future, a kind of social score. One example is: https://github.com/iudex/iudex. This will only address the issue that the wallet owner could try to change actual arrangements in order to receive the future tokens in other address. For example, the user can create a Tradeable Wallet, include it on SAFT (a kind of ICO contract) and, after selling the Wallet, try to change the used address making an agreement with the ICO development team directly. But, we also have other ideas that is going to mitigate this risk.
Since front-end was developed using a responsive framework, it can easily used in a mobile environment in the future. It could be done with **Cipher** for example.
