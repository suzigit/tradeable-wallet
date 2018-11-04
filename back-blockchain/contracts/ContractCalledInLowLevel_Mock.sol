pragma solidity ^0.4.23;

/**
 * @title ContractCalledInLowLevel_Mock.
 */
contract ContractCalledInLowLevel_Mock {

    address depositDestinationAddress;

	constructor (address newDepositDestinationAddress) public {
        depositDestinationAddress = newDepositDestinationAddress;
	}


	function deposit() public payable {
		depositDestinationAddress.transfer(msg.value);
	}
    
}