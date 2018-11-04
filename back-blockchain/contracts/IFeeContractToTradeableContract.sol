pragma solidity ^0.4.23;

/**
 * @title Fee.
 */
interface IFeeContractToTradeableContract {


	function getFeeValueInWei(uint128 valueInWei, address addrSelller) view external returns (uint128);

	function getDenominatorFee() view external returns (uint8);

	function getFeeDestinationAddress() view external returns (address);

}