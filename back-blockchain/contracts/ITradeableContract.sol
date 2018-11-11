pragma solidity ^0.4.23;

/**
 * @title ITradeableContract
 * @dev Contract that represent a Wallet, whose ownership can be traded (sell/buy).
 * This contract can be used to receive tokens, and has a specific function to withdraw these tokens. 
 */
interface ITradeableContract {

  /**
   * @dev Event to inform a new owner of this Contract. 
   * Do not index the owner (old nor current) since it can assume too many values.   
   * When the contract is created, it is fired with the old owner 0x0.    
   */ 
	event NewOwnerEvent(address old, address current);
	

  /**
   * @dev Event to inform a new transfer of tokens from/to this contract. 
   */ 
	event TransferTokensEvent(address tokenAddr, address owner, uint256 value, bool indexed isWithdraw, bool sucess);
	

  /**
   * @dev Event to inform a new transfer of ETH from/to this contract. 
   */ 
	event TransferETHEvent(address owner, uint256 value, bool indexed isWithdraw, bytes hexData);

  /**
   * @dev Event to inform that one contract became available to sell. 
   * Do not index the owner nor contractAdd since they can assume too many values.   
   */ 
	event AvaliableToSellEvent(address owner, address contractAddr, bool indexed isActionOfSelling);

  /**
   * @dev Event to inform that a deposit of Ether was made in this contract. 
   */ 
  event	DepositReceivedEvent(address sender); 


  /**
   * @dev Return the current owner of this contract.
   * @return the owner of this contract.
   */	
	function getOwner() view external returns (address);

  /**
   * @dev Return the hash description of this contract.
   * @return the hash to the description of this contract.
   */	
	function getHashDescription() external view returns (string);

  /**
   * @dev Change the hash to the description to this wallet.
   * @param hDescription new hash description to this wallet.
   * It should only be called by the owner.
   */	
	function changeHashDescription(string hDescription) external;

  /**
   * @dev Return the price for sell this contract, in Wei. 
   * If the current owner does not put it for sale, the returned value is going to be -1.
   * @return price in Wei or -1.
   */
	function getPriceToSellInWei() external view returns (int256);

  /**
   * @dev Returns denominator to be used in the calculation of fee value
   * The fee value is calculated by price (in Wei)/(denominator fee).
   * @return Denominator to calculate fee value 
   */
	function getDenominatorFee() external view returns (uint8);


   /**
	* @dev Indicate that this contract is available to sell.
	* It should only be called by the owner.
	* It should emit an event in order to allow anyone to monitor new opportunities to buy.
	* @param priceInWei Price that the owner wants to sell this contract (in Wei)
	* @param hDescription Hash to the description of this contract 
	*/
 	function setAvailableToSell (uint128 priceInWei, string hDescription) external;

  function cancelSellingAction() external;


   /**
	* @dev Change the ownership of this contract. It happens when someone buys an available to sell contract.
	* This functions is payable - It should receive necessary money to cover the contract price.
	*
    * This function is marked as untrusted since this smart contract cannot trust the code of external calls.
	*
	* It should emit an event with the old and new owners.
	*/
	function untrustedChangeOwnershipWithTrade () payable external;

   /**
	* @dev Since this contract represents a wallet it is worth to enable the possibility to receive ether.
	*/
	function() payable external;


  /**
   * @dev Transfer tokens from external contracts to the owner of its contract. 
   *
   * This function is marked as untrusted since this smart contract cannot trust external calls.
   *
   * It should emit an event representing the withdraw. 
   * It should only be called by the owner.
   * 
   * @param tokenAddr address of tokens to be transfered.
   * @param value Value of tokens to be withdraw.
   * @return bool from the transfer function in tokenAddr.
   */
	function makeUntrustedWithdrawalOfTokens(address tokenAddr, uint256 value) external returns (bool);


  /**
   * @dev Transfer ether from external contracts to the owner of its contract. 
   *
   * This function is marked as untrusted since this smart contract cannot trust external calls.
   * It does not return any value, throwing an exception in case of failure.
   *
   * It should emit an event representing the withdraw. 
   * It should only be called by the owner.
   * 
   * @param valueInWei Value of ether to be withdraw (in Wei).
   */
	function makeUntrustWithdrawOfEther(uint256 valueInWei) external;

  /**
   * @dev Transfer tokens from this contract to an external account. 
   *
   * This function is marked as untrusted since this smart contract cannot trust external calls.
   *
   * It should emit an event representing the transfer. 
   * It should only be called by the owner.
   * 
   * @param tokenAddr address of tokens to be transfered.
   * @param to address to be transfered.
   * @param value Value of tokens to be transfered.
   */
	function makeUntrustedTokenTransferToOutside(address tokenAddr, address to, uint256 value) external returns (bool);


  /**
   * @dev Transfer Ether from this contract to an external account.
   * If there is hexData, it works as a relayer fowarding the data
   *
   * This function is marked as untrusted since this smart contract cannot trust external calls.
   * It does not return any value, throwing an exception in case of failure.
   *
   * It should emit an event representing the transfer. 
   * It should only be called by the owner.
   * 
   * @param to address to be transfered.
   * @param valueInWei Value of ether to be transfered.
   * @param hexData is the SHA3 of the function+ (if any) params to be called. 
   *        It can accept any number of bytes, as they are relayed to the next call.  
   */
	function makeUntrustedEtherTransferToOutside(address to, uint256 valueInWei, bytes hexData) external;

  /**
   * @dev Return the ether balance of this contract. 
   * @return ether balance of this contract
   */
	function getEtherBalance () external view returns (uint256);

  /**
   * @dev Return the token balance of this contract.
   * @param tokenAddr the address of the token which balance will be returned 
   * @return token balance of this contract
   */
	function getTokenBalanceOf (address tokenAddr) external view returns (uint256);


  function tokenFallback(address _from, uint _value, bytes _data) external;

  function getTotalBlocksToFinishFrontRunningRiskExternal () view external returns (uint256);

  function getFeeContractAddress() view external returns (address);



}


