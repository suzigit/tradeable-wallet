pragma solidity ^0.4.23;

/**
 * @title TokenERC20_Mock
 * @dev Mock to a ERC20 Token to be used for testing purposes.
 */
contract TokenERC20_Mock {

    // Public variables of the token
    string public name;
    string public symbol;
    uint8 public decimals;
    
    // 18 decimals is the strongly suggested default, avoid changing it
    uint256 public totalSupply;

    // Map with all balances
    mapping (address => uint256) public balanceOf;

    // Map of Maps. Each address of the first map is mapped to a map from address 
    //that are authorized to transfer up to a total in his behalf.
    mapping (address => mapping (address => uint256)) public allowance;    

    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint256 value);    

    /**
     * @dev Constructor function.
     * Initializes contract with initial supply tokens to the creator of the contract
     * @param initialSupply The number of tokens to be created
     * @param tokenName Name of the token to be created
     * @param tokenSymbol Symbol of the token to be created
     */
    constructor (
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol
    ) public {
        totalSupply = initialSupply * 10 ** uint256(decimals);  // Update total supply with the decimal amount
        balanceOf[msg.sender] = totalSupply;                // Give the creator all initial tokens
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes     
    }

    /**
     * Internal transfer, only can be called by this contract
     */
    function _transfer(address _from, address _to, uint _value) internal {
        // Prevent transfer to 0x0 address. Use burn() instead
        require(_to != 0x0);
        // Check if the sender has enough
        require(balanceOf[_from] >= _value);
        // Check for overflows
        require(balanceOf[_to] + _value > balanceOf[_to]);
        // Save this for an assertion in the future
        uint previousBalances = balanceOf[_from] + balanceOf[_to];
        // Subtract from the sender
        balanceOf[_from] -= _value;
        // Add the same to the recipient
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        // Asserts are used to use static analysis to find bugs in your code. They should never fail
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }

  /**
   * @dev Transfer the balance of the msg.sender account to another account.
   * 
   * @param to The address of the recipient
   * @param tokens the amount to send
   */
    function transfer(address to, uint tokens) public returns (bool success) {
        require(balanceOf[msg.sender] >= tokens);
        require(balanceOf[to] + tokens >= balanceOf[to]);

        balanceOf[msg.sender] -= tokens;
        balanceOf[to] += tokens;
        emit Transfer(msg.sender, to, tokens);
        return true;
    }

    /**
     * @dev Transfer tokens from other address
     * Send `_value` tokens to `_to` in behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= allowance[_from][msg.sender]);     // Check allowance
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    /**
     * @dev Set allowance for other address
     * Allows `_spender` to spend no more than `_value` tokens in your behalf
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     */
    function approve(address _spender, uint256 _value) public
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /**
     * @dev Return the token balance of a given address
     * @param _addr address to get the balance
     * @return token balance of the address
     */
    function getBalanceOf(address _addr) view public returns(uint256)
    {
        return balanceOf[_addr];
    }

    /**
     * @dev Return the total supply of the token
     * @return total token supply
     */
    function getTotalSupply() view public returns (uint256)
    {
        return totalSupply;
    }
    
}
