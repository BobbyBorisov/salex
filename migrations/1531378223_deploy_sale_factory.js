var SaleFactory = artifacts.require("./SaleFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(SaleFactory);
};
