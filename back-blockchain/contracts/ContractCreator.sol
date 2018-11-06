pragma solidity ^0.4.23;

import "./TradeableContract.sol";
import "./ITradeableContract.sol";
import "./FeeContract.sol";

/**
 * @title ContractCreator.
 * @dev Creator of Tradeable Wallet contracts. It is also a repository of Tradeable Wallet addresses.
 */
contract ContractCreator {

  /**
   * @dev Stores the information if the some functions should be paused in case of some undesirable situation (circuit breaker).   
   */
	bool public stopped = false;
	
  /**
   * @dev Owner of this contract.   
   */
	address public owner;	

  /**
   * @dev Stores all contracts already created.
   */
	address[] public contracts;

  /**
   * @dev Stores the address of fee contract
   */
  address public feeContract;

  /**
   * @dev Stores the minimum number of blocks to wait in case of danger of front running
   */
  uint8 public numberOfBlocksToPreventFrontRunning;

  /**
   * @dev Event to inform the creation of a new Tradeable  Wallet   
   */ 
 	event NewTradeableWallet(address addr);

  /**
   * @dev Assure that only the owner can invoke a function.   
   */
	modifier onlyOwner { 
		require(msg.sender == owner); 	
		_; 	
	}		
	
  /**
   * @dev Safe mechanism check and pause the function in case of some undesirable situation (circuit breaker).   
   */
	modifier stopInEmergency { 
		require(!stopped); 
		_; 
	}


  /**
   * @dev Create a new contract. 
   * The owner is going to be msg.sender.   
   */
	constructor (uint8 newNumberOfBlocksToPreventFrontRunning, uint8 denominatorFee, address feeAddress) public {
		owner = msg.sender;
    numberOfBlocksToPreventFrontRunning = newNumberOfBlocksToPreventFrontRunning;
    feeContract = new FeeContract(owner, denominatorFee, feeAddress);
	}

  /**
   * @dev Kill the contract creator.
   * It can only be called by the owner.   
   */
	function kill() public onlyOwner {
		selfdestruct(owner);
	}

  /**
   * @dev create a new Tradeable Contract, stores its reference and emit an event with the same info 
   * @return subcontractAddr the address of the create contract.
   */
	function createTradeableContract() public stopInEmergency returns(address subcontractAddr) {
		ITradeableContract tc = new TradeableContract(msg.sender, feeContract, 240); 
		contracts.push(tc);
		emit NewTradeableWallet(address(tc));
		return tc;		
	}

  /**
   * @dev Useful to enable a pause in the creation of new Tradeable Contracts. 
   * It can only be called by the owner.
   * @param b If true, it is not possible to create new Tradeable Contracts.
   */
	function setCircuitBreaker (bool b) public onlyOwner {
		stopped = b;
	} 	

	function setNumberOfBlocksToPreventFrontRunning (uint8 n) public onlyOwner {
		numberOfBlocksToPreventFrontRunning = n;
	} 	

	function getNumberOfBlocksToPreventFrontRunning () public view returns (uint8) {
		return numberOfBlocksToPreventFrontRunning;
	} 	

  /**
   * @dev Returns the number of Tradeable Contract created. 
   * @return contractCount the number of Tradeable Contract created.
   */
	function getContractCount() public view returns(uint contractCount) {
		return contracts.length;
	}

  /**
   * @dev Returns the address the Tradeable Contract created on a specific index. 
   * @param index index of the desirable result
   * @return the address of the desirable Tradeable contract or 0x0 (if not found)
   */
	function getContractAt(uint index) public view returns (address) {
		if (index<contracts.length) {
			return contracts[index];
		}
		return 0x0;
	}

  /**
   * @dev Returns the owner of this contract.
   * @return the owner of this contract.
   */
	function getOwner() public view returns (address) {
		return owner;
	}

  function getFeeContractAddress() public view returns (address) {
    return feeContract;
  }

}