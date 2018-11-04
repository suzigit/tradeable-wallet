var TradeableContract  = artifacts.require("./TradeableContract.sol");
var TokenERC20_Mock = artifacts.require("./TokenERC20_Mock.sol");

/**
 * @dev See Readme.md to more info regarding what the tests are covering and 
 * why those tests were chosen.
 */
contract('TradeableContract', function(accounts) {

  const initialOwner = "0x627306090abab3a6e1400e9345bc60c78a8bef57";
  const alice = accounts[1];
  const bob = accounts[2];


  it("should create the contract with the correct owner", function () {
    return TradeableContract.deployed()
        .then(function (instance) {
            return instance.getOwner.call();
        }).then(function (owner) {
            assert.equal(owner, initialOwner, "Owner does not match");      
        })
  });


  it("should perform a withdraw operation using owner", function () {
    return TradeableContract.deployed()
        .then(function (tcInstance) {
            return TokenERC20_Mock.deployed().then(function(tokenInstance) {
                    return tcInstance.makeUntrustedWithdrawalOfTokens(tokenInstance.address, 0, {from: initialOwner});
            })             
        })
        .then(function (result) {
            let eventName = result.logs[0].event;
            let args = result.logs[0].args;
            assert.equal(eventName, "TransferTokensEvent", 'TransferTokensEvent event should fire.');
            assert.equal(args.sucess, true, 'TransferTokensEvent should indicate sucess.');
        })
  });


  it("should not perform a withdraw operation if not using owner", function () {
    return TradeableContract.deployed()
        .then(function (tcInstance) {
            return TokenERC20_Mock.deployed().then(function(tokenInstance) {
                    return tcInstance.makeUntrustedWithdrawalOfTokens(tokenInstance.address, 0, {from: alice})
                            .then(function(r) {
                                assert(false, 'should not performed withdraw!!!');
                                return true;
                            },
                            function(e) {
                                assert.match(e, /VM Exception/, "withdraw not using owner should have raised VM exception");
                            });
                    })             
        })
  });


  it("should put wallet for sale using owner", function () {
    let price = 20;
    return TradeableContract.deployed()
        .then(function (tcInstance) {
            return tcInstance.setAvailableToSell(price,"", {from: initialOwner})
            .then(function() {
                return tcInstance.getPriceToSellInWei.call();
            })
        })
        .then(function (result) {
                assert.equal(result, price, 'Wallet price should be .' + price);
         });
  });


  it("any user should buy a sellable wallet paying enough", function () {
    let price = 20;
    return TradeableContract.deployed()
        .then(function (tcInstance) {
            return tcInstance.setAvailableToSell(price, "", {from: initialOwner})
            .then(function() {
                return tcInstance.untrustedChangeOwnershipWithTrade({from: alice, value:price})
                    .then(function() {
                        return tcInstance.getOwner.call();
                    });
            });
        })
        .then(function (result) {
            assert.equal(result, alice, "Owner is not who bought the wallet");      
         });
  });

  it("should not buy a wallet that is not sellable", function () {
    let price = 20;
    return TradeableContract.deployed()
        .then(function (tcInstance) {
                return tcInstance.untrustedChangeOwnershipWithTrade({from: bob, value:price})
                            .then(function(r) {
                                assert(false, 'should not performed trade!!!');
                                return true;
                            },
                            function(e) {
                                assert.match(e, /VM Exception/, "trade with not not available to sell wallet should have raised VM exception");
                            });
        })
  });

  it("should not buy a sellable wallet if not paying enough", function () {
    let price = 20;
    return TradeableContract.deployed()
        .then(function (tcInstance) {
            return tcInstance.setAvailableToSell(price, "", {from: alice})
            .then(function() {
                return tcInstance.untrustedChangeOwnershipWithTrade({from: bob, value:price-1})
                            .then(function(r) {
                                assert(false, 'should not performed trade!!!');
                                return true;
                            },
                            function(e) {
                                assert.match(e, /VM Exception/, "trade with not enough value should have raised VM exception");
                            });
            });
        })
  });


});
