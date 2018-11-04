var ContractCreator  = artifacts.require("./ContractCreator.sol");

var TradeableContract  = artifacts.require("./TradeableContract.sol");

/**
 * @dev See Readme.md to more info regarding what the tests are covering and 
 * why those tests were chosen.
 */
contract('ContractCreator', function(accounts) {

  const initialOwner = "0x627306090abab3a6e1400e9345bc60c78a8bef57";
  const alice = accounts[1];
  const bob = accounts[2];


  it("should create the contract with the correct owner", function () {
    return ContractCreator.deployed()
        .then(function (instance) {
            return instance.getOwner.call();
        }).then(function (owner) {
            assert.equal(owner, initialOwner, "Owner does not match");      
        })
  });


  it("should create a Tradeable Contract", function () {
    return ContractCreator.deployed()
        .then(function (instance) {
            return instance.createTradeableContract()
            .then(function() {
                return instance.getContractCount.call();
            })
        }).then(function (total) {
            assert.equal(total, 1, "Total of Tradeable Contracts should be 1.");      
        })
  });

  it("should create two Tradeable Contract with different users", function () {
    return ContractCreator.deployed()
        .then(function (instance) {
            return instance.createTradeableContract({from: initialOwner})
            .then(function() {
                return instance.createTradeableContract({from: alice})
                .then(function() {
                    return instance.getContractCount.call();
                })
            }) 
        }).then(function (total) { //2+1 (previous test)
            assert.equal(total, 3, "Total of Tradeable Contracts using different users should be 3.");      
        })
  });

  it("should set circuit breaker and do not allow more contract creation", function () {
    return ContractCreator.deployed()
        .then(function (instance) {
            return instance.setCircuitBreaker(true)
            .then(function() {
                return instance.createTradeableContract()
                .then(function (rSucess) {
                    assert(false, 'should not performed creation!!!');
                    return true;
                }, function(e) { //could not create a new tradeable contract
                    assert.match(e, /VM Exception/, "create contract with circuit breaker should have raised VM exception");
                })
            }) 
        })
  });

  it("should remove circuit breaker and allow more contract creation", function () {
    return ContractCreator.deployed()
        .then(function (instance) {
            return instance.setCircuitBreaker(false)
            .then(function() {
                return instance.createTradeableContract()
                .then(function () {
                        return instance.getContractCount.call();                    
                },
                function(e) { //could not create a new tradeable contract
                    assert.match(e, /VM Exception/, "should not have raised exception anyomore");
                })
            })
          .then(function (total) {
                assert.equal(total, 4, "Total of Tradeable Contracts should be 4.");      
            })
        });
    });

});

