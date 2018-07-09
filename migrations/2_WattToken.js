var TokenContract = artifacts.require("./WorkToken.sol");

module.exports = function(deployer) {
  deployer.deploy(TokenContract);
};
