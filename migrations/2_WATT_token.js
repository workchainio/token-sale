var TokenContract = artifacts.require("WATT");

module.exports = async function(deployer, network, accounts) {

  if (network == "staging") {
    await TokenContract.at('0x0290fb167208af455bb137780163b7b7a9a10c16');
  } else if(network == "live") {
    throw "Trying to deploy unimplemented constructor to the live network";
    await TokenContract.at('0x0');
  } else {
    await deployer.deploy(TokenContract);
  }
};