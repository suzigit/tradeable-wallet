pragma solidity ^0.4.23;

/**
 * @title FeeContract.
 */
contract FeeContract {


  /**
   * @dev Denominator to be used to caculate fee. 
   * The fee value is calculated by priceToSellInWei/denominatorFee.
   * Should be a number >34 (because it will be used to calculate price/denominator, which should be <= 3%)
   */	
  uint8 public denominatorFee;

  /**
   * @dev The address of who is going to receive the fee
   */	
  address feeDestinationAddress;

  /**
   * @dev The set of ambassors. They do not pay fees
   */	
  address[] ambassadorAddress;

  
  /**
   * @dev Owner of this contract.   
   */
	address public owner;	
  
	
  /**
   * @dev Assure that only the owner can invoke a function.   
   */
	modifier onlyOwner { 
		require(msg.sender == owner); 	
		_; 	
	}		
	
  /**
   * @dev Create a new contract. 
   * The owner is going to be msg.sender. 
   *   
   */
	constructor (address newOwner, uint8 newDenominatorFee, address newDestinationAddr) public {
		require (newDenominatorFee >= 34); //The fee must be at most 3%

		owner = newOwner;
        denominatorFee = newDenominatorFee;
        feeDestinationAddress = newDestinationAddr;
	}

	function setDenominatorFee(uint8 newDenominatorFee) public onlyOwner {
		require (newDenominatorFee >= 34);
        denominatorFee = newDenominatorFee;
	}

	function setFeeDestinationAddress(address newAddr) public onlyOwner {
        feeDestinationAddress = newAddr;
	}

    function addAmbassadorAddressAddress(address newAddress) onlyOwner external {
        int8 index = searchAmbassadorAddress(newAddress); 
        
        require(index==-1);//not find the element

        ambassadorAddress.push(newAddress);
    }

    function deleteAmbassadorAddress(address addrToRemove) onlyOwner external {

        int8 index = searchAmbassadorAddress(addrToRemove); 
        
        require(index!=-1);//find the element

        for (uint i=uint(index); i<ambassadorAddress.length-1; i++) {
            ambassadorAddress[i] = ambassadorAddress[i+1];
        }
        delete ambassadorAddress[ambassadorAddress.length-1];
        ambassadorAddress.length--;
    }

    function searchAmbassadorAddress(address addr) view public returns (int8) {
        int8 index = -1;
        for (uint i=0; i<ambassadorAddress.length; i++) {
            if (ambassadorAddress[i]==addr) {
                
                //There would not be so many ambassors to this line be a problem
                index = int8(i);
                break;
            }
        }
        return index;
    }

    function getAmbassadorAddressAt(uint index) view external returns (address) {
        require (index < ambassadorAddress.length);
        return ambassadorAddress[index];
    }

    function getAmbassadorAddressLenght() view external returns (uint) {
        return ambassadorAddress.length;
    }

  /**
   * @dev Returns denominator to be used in the calculation of fee value
   * The fee value is calculated by price (in Wei)/(denominator fee).
   * @return Denominator to calculate fee value 
   */
	function getDenominatorFee() view external returns (uint8) {
		return denominatorFee;
	}

	function getFeeDestinationAddress() view external returns (address) {
		return feeDestinationAddress;
	}


	function getFeeValueInWei(uint128 valueInWei, address addr) view external returns (uint128) {
		
        int8 indexAddrSeller = searchAmbassadorAddress(addr);
        if (indexAddrSeller!=-1) {
            return 0;
        } 
        else {
            return valueInWei/denominatorFee;
        }
	}




}