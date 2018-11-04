pragma solidity ^0.4.23;


/**
 * @title IERC20Token
 * @dev IERC20 parcial interface, to be used to invoke transfer function.
 */
interface IERC20Token {

  /**
   * @dev Reproduces the signature of a transfer function from a ERC-20 token.
   * The token is transfer from the msg.sender.
   * 
   * @param to The address of the recipient
   * @param amount the amount to send
   */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Return the token balance of a given address
     * @param addr address to get the balance
     * @return token balance of the address
     */
    function balanceOf(address addr) external view returns(uint256);

}