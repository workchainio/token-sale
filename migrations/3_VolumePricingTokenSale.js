const TokenContract = artifacts.require("WATT");
const SaleContract = artifacts.require("VolumePricingTokenSale");

module.exports = async function(deployer, network, accounts) {

  const rate = 166;
  const volumeRate = 250;
  const volumeThreshold = web3.toBigNumber(10).mul(10**18);

  let sellerAddress = accounts[0];
  let proceedsAddress = accounts[0];

  if (network == "staging") {
    sellerAddress = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
    proceedsAddress = sellerAddress;
  } else if (network == "live") {
    throw "Trying to deploy unimplemented constructor to the live network";
    sellerAddress = "";
    proceedsAddress = "";
  }

  deployer.deploy(SaleContract, rate, volumeRate, volumeThreshold, proceedsAddress, sellerAddress, TokenContract.address);
};
