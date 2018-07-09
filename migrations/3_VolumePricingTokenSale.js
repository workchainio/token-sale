var SaleContract = artifacts.require("./VolumePricingTokenSale.sol");
var TokenContract = artifacts.require("./WorkToken.sol");

module.exports = function(deployer, network, accounts) {
  rate = 166;
  volumeRate = 250;
  volumeThreshold = web3.toBigNumber(10).mul(10**18);
  if (network == "staging") {
    tokenContractAddress = "0x0290fb167208af455bb137780163b7b7a9a10c16";
    sellerAddress = accounts[0];
    proceedsAddress = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
  }
  else if (network == "live") {
    //TODO: Define production values
    tokenContractAddress = "";
    sellerAddress = "";
    proceedsAddress = "";
    throw "Trying to deploy unimplemented constructor to the live network";
    
  }
  else{
    tokenContractAddress = TokenContract.address;
    sellerAddress = accounts[0];
    proceedsAddress = sellerAddress;
  }  
  deployer.deploy(SaleContract, rate, volumeRate, volumeThreshold, proceedsAddress, sellerAddress, tokenContractAddress);
};
