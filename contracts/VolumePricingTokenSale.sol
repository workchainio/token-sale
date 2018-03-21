pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
//The token contract is not a dependency but is used in tests so importing it here for compilation
import "work-token/contracts/WorkToken.sol";
/**
 * @title AllowanceCrowdsale
 * @dev Extension of AllowanceCrowdSale where a discounted rate can be applied to purchases over a certain amount
 */
contract VolumePricingTokenSale is AllowanceCrowdsale
{
    uint256 public volumeRate;
    uint256 public volumeThreshold;

    /**
    * @dev Constructor, takes token wallet address, rate, volume rate & threshold and wallet to forward ether to.
    * @param _rate Number of token units a buyer gets per wei
    * @param _volumeRate Number of token units a buyer gets per wei for volume purchases
    * @param _volumeThreshold Number of tokens necessary to qualify for volume pricing
    * @param _wallet Address where collected funds will be forwarded to
    * @param _tokenWallet Address which holds the tokens to be sold and has approved an allowance to this contract
    * @param _token Address of the token being sold
    */
    constructor(uint256 _rate, uint256 _volumeRate, uint256 _volumeThreshold, 
                        address _wallet, address _tokenWallet, ERC20 _token)
    Crowdsale(_rate, _wallet, _token)
    AllowanceCrowdsale(_tokenWallet) public {
        require(_volumeRate > 0);
        require(_volumeRate > _rate);
        require(_volumeThreshold > 0);
    
        volumeRate = _volumeRate;
        volumeThreshold = _volumeThreshold;
    }

    /**
    * @dev Override to take into account volume pricing
    * @param _weiAmount Value in wei to be converted into tokens
    * @return Number of tokens that can be purchased with the specified _weiAmount
    */
    function _getTokenAmount(uint256 _weiAmount)
        internal view returns (uint256)
    {
        uint256 volumeAmount = _weiAmount.mul(volumeRate);
        if( volumeAmount >= volumeThreshold)
        {
            return volumeAmount;
        }
        return _weiAmount.mul(rate);
    }
}