var TokenERC20_Mock = artifacts.require("./TokenERC20_Mock.sol");
//var TradeableContract_OnlyForTests = artifacts.require("./TradeableContract.sol");
var FeeContract = artifacts.require("./FeeContract.sol");
var ContractCreator = artifacts.require("./ContractCreator.sol");


module.exports = function(deployer) {

  deployer.deploy(TokenERC20_Mock, 100, "name", "sy");
//  deployer.deploy(FeeContract, 0x0, 45, 0xf17f52151EbEF6C7334FAD080c5704D77216b732);

//  deployer.deploy(TradeableContract_OnlyForTests, "0x627306090abab3a6e1400e9345bc60c78a8bef57");
 //    feeContract = new FeeContract(owner, 45, 0xe4aaa0fc768fbbafaa15f3cf16530b1d082a95b0);

  deployer.deploy(ContractCreator,  45, 0xf17f52151EbEF6C7334FAD080c5704D77216b732);

};
