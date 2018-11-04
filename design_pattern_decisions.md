This doc explains why I chose to use the design patterns that I did during the development of Smart contracts, how I designed the upgradability of these smart contracts, what best practices were used and what were the front-end design patters related to blockchain.


Design Patters in Smart Contracts
---------------------------------

This explanation takes this link into consideration: https://solidity.readthedocs.io/en/develop/common-patterns.html and https://github.com/cjgdev/smart-contract-patterns.


1. I used **Factory** pattern in  _ContractCreator_ to create multiple instances of _TradeableContract_. See the explanation here: https://ethereum.stackexchange.com/questions/13415/deploy-contract-from-contract-in-solidity.
The main smart contract is _TradeableContract_. Its implementation enables TRUSTLESS sell & buy functions.  _ContractCreator_ was created in order to be more transparent about the _TradeableContract_ already created. One could argue that _ContractCreator_ is not necessary and the front-end could create the  _TradeableContract_. It is indeed an option. However, I decided to have a _ContractCreator_ as a way to show all users what are _TradeableContract_ already deployed. It can help to increase the TRUST in the overall solution.

2. **Circuit Breaker**. There is a Ciruit Breakear implementation at _ContractCreator_. If something bad happens, we can pause the creation of new contracts. It can also help when upgrading the solution to add/change features in the Tradeable Wallet - as discussed at (2).  I did not implemented a Circuit Breaker at _ITradeableContract_ because it is almost the same as the variable _isAvailableToSell_. The functions that are not covered by _isAvailableToSell_ are only available to the owner and protected by _onlyOwner_ modifier. Since a circuit would use the same modifier, a vulnerability in these functions can also impact the circuit breaker itself.

3. **Restricting Access/Ownership**
Some functions can only be invoked by the contract owner. It was implemented by using the modifier _onlyOwner_ at  _ContractCreator_ and _TradeableContract_.

4. **(I)-Mortal**
The ability to destroy the contract and remove it from the blockchain was NOT implemented at _TradeableContract_. I believe this function could introduce a big operational risk in this specific situation. If any token is not delivered yet and the owner destroys the wallet, he is going to lock his tokens forever. The benefit of saving gas when the owner not need the contract anymore is not enough to justify this risk. Also, there would be an additional cost in the deploy of each  _TradeableContract_ instance.
The Mortal pattern was implemented at _ContractCreator_.

5. **Favor pull over push payment** 
The function _makeUntrustedWithdrawalOfTokens_ does it with a simple code. When necessary, the owner ask for his withdraw. Push payments would require for example listen events of ERC-20 token and invoke a way of push payments in all wallets registered to this token, for example.  
The function _makeUntrustWithdrawOfEther_ also is a way of implementing this pattern. During the execution of _untrustedChangeOwnershipWithTrade_ the new owner can send more ether that it was necessary to buy the wallet. So, it can _makeUntrustWithdrawOfEther_ later.


Upgradable design
------------------

I added an interface _ITradeableContract_ to help with upgradability. The idea is, over time, new kind of _TradeableContract_ may exist. 
For example, the actual implementation of _ITradeableContract_ assumes that the token must be an ERC-20, the calculation of fee is fixed. The fee must be sent to a fixed address. Future implementations may have different business rules, but it will probabily follow the same interface. The front-end only depends on _ITradeableContract_, and not on its implementation.
Also, I added a function _getContractAt_ to retrive the set of contracts stored in _ContractCreator_. It will help when upgrading this contract.

Obs.: Lib with Factory pattern
Reducing the size of the _TradeableContract_  may save a lot of gas in deployment costs over the lifetime of the contract. Moving functions that are referenced by the _TradeableContract_ to a library can reduce the its size.
However, calling library functions from the _TradeableContract_ is a bit more expensive than calling internal functions, so there is a tradeoff to consider. In the future, I intend to test if is worth to extract some parts of _TradeableContract_ to a lib. I have to calculate considering the specific use of the proposed solution. If necessary, I can do the upgradability, as explained in (2).



Best Practices
--------------

In addition to these patterns, this project is also considering best practices documented at
https://consensys.github.io/smart-contract-best-practices/recommendations/.


1. **Fail early and fail loud**
The necessary conditions to execute functions are checked in the beginning of the developed functions using require. E.g. _require(msg.value >= priceToSellInWei)_

2. **Be aware of the tradeoffs between send(), transfer(), and call.value()()**. The external calls in _makeUntrustedWithdrawalOfTokens_ function (_TradeableContract_) could be done in low-level (call) or high-level (contract calls e.g., _ExternalContract.doSomething()_ ). I adopted high-level for two reasons. (a) It is easiest to code and undestand and (b) In this case is desirable that the function fails if the external call fails.

3. It is a best practice that in 2-party or N-party contracts, the developer should beware of the possibility that **some participants may "drop offline"** and not return. The Tradeable Contract follow this recommendation by segregating in two functions a trade operation. There a function to be invoked by the seller and a later function to be invoked by the buyer.

And the following ones:
* Mark untrusted contracts
* Be aware of the tradeoffs between abstract contracts and interfaces
* Keep fallback functions simple
* Explicitly mark visibility in functions and state variables
* Lock pragmas to specific compiler version
* Differentiate functions and events
* Prefer newer Solidity constructs
* Be aware that 'Built-ins' can be shadowed
* Avoid using tx.origin


Front-end patterns used related to blockchain:
---------------------------------------------

1. **Listening for Selected Account Changes**. The front-end shows what is the selected account by following Metamask pattern as documented at: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md.  It was adapted to web 3 1.0.

2. **Network check**. The front-end shows what the network the user is in using by following Metamask pattern as documented at: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md. It was adapted to web 3 1.0.  

3. **Web3 layer**. Every communication front-end x blockchain is concentrated at class src/app/service/blockchain-service.ts. This layer was created in order to easily change the way the communication takes place. For example, I choose to use web3 1.0 beta. However, if I had found a bug (since it is still in beta), I could have changed to use web3 version 0.2. It also helps to accommodate function name changes during development.