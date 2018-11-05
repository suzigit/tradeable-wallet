pragma solidity ^0.4.23;

/**
 * @title ContractCalledInLowLevel_Mock.
 */
contract ContractCalledInLowLevel_Mock {

    address depositDestinationAddress;
    uint256 public lastReceivedUint = 0;
    event received( uint256 );

	constructor (address newDepositDestinationAddress) public {
        depositDestinationAddress = newDepositDestinationAddress;
	}


	function deposit() public payable {
        emit received( msg.value );
		depositDestinationAddress.transfer(msg.value);
	}

    function receiver() public payable {
        emit received( msg.value );
    }

    function receiverWithArgs( uint256 test ) public payable {
        lastReceivedUint = test;
        emit received( msg.value );
    }    
}