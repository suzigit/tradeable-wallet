This doc explains what measures I took to ensure that my contracts are not susceptible to common attacks.
This explanation takes this link into consideration: https://consensys.github.io/smart-contract-best-practices/known_attacks/.
Take also a look at design_patterns_decisions.md because many design patterns/best practices aim to avoid attacks.

1. **_Race Conditions_**

* Avoid state changes after external calls (Checks-Effects-Interactions). In the _TradeableContract_ it is true at the following functions: _makeUntrustedWithdrawalOfTokens_ and _untrustedChangeOwnershipWithTrade_. The function _makeUntrustedWithdrawalOfTokens_ has an additional line after the external call to emit an event. It is worth to mention that it is not a state change. 

* Use of _transfer_, instead of _send_ or _call_ in the _changeOwnershipWithTrade_ because: 
 _call_ is not a safe option against reentrancy, since the executed code is given all available gas for execution.
 _send_ and _transfer_ are considered safe against reentrancy. While these methods still trigger code execution, the called contract is only given a stipend of 2,300 gas which is currently only enough to log an event. _x.transfer(y)_ is equivalent to _require(x.send(y))_;, it will automatically revert if the send fails. Since it is desirable that _untrustedChangeOwnershipWithTrade_ (from _TradeableContract_) fails if the operation fails, _transfer_ is a better option.


2. **Transaction-Ordering Dependence (TOD) / Front Running**

* The _TradeableContract_ restricts access to _setAvailableToSell_ to the owner.


3. **Integer Overflow and Underflow**

* The function _untrustedChangeOwnershipWithTrade_ (from _TradeableContract_) calculates a fee to be charged from the buyer. It does not use multiplication operation in order to **avoid integer overflow**. To calculate a fee of 2.5%, the function does not multiplies to 2.5 and divides by 100. The codes divides by 40. 

* Use of **_unsigned int_ for representing prices values**. Avoid the complexity (and potencial risks) of dealing with negative number for representing prices.


4. **DoS with (Unexpected) revert / DoS with Block Gas Limit**

* Use favor pull over push payments pattern (see design_pattern_decisions.md).


5. **Forcibly Sending Ether to a Contract**

* Regarding to _TradeableContract_ => the function _untrustedChangeOwnershipWithTrade()_ does not assume a specific balance and the function _reclaimEther()_ can reclaim any received Ether.


I also took a look at **infrastructure bugs** to avoid them. The description of bugs are at: https://solidity.readthedocs.io/en/develop/bugs.html. Many of this bugs does not happen at solidity 0.4.23, version of language that I used. The unique know bug that can happen at this version is **EventStructWrongData** - I avoid by not using struct in events. When emitting an event, I passed many arguments, but not a struct.