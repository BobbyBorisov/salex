var factoryContract = artifacts.require("./SaleFactory.sol");
var saleContract = artifacts.require("./Sale.sol");


contract('SaleFactory', function(accounts) {

  let factory;
  let sale;
  let itemPriceInWei;

  beforeEach('setup contract for each test', async() => {
    factory = await factoryContract.deployed();

    itemPriceInWei = web3.toWei('0.001', 'ether');
    await factory.createSale("first item", "description", itemPriceInWei, "photohash", {from:accounts[1]});
    const saleAddresses = await factory.getDeployedSales.call();
    sale = saleContract.at(saleAddresses[saleAddresses.length - 1]);
  })

  it("initial balance is 0", async () => {
    const balance = await factory.getBalance.call();
    assert.equal(0, balance);
  });

  it("can deploy a sale", async() => {
    const summary = await sale.getSummary.call();
    const creatorAddress = await sale.creator.call();
    const ownerContractAddress = await sale.ownerContract.call();

    assert.equal("first item", summary[0]);
    assert.equal("description", summary[1]);
    assert.equal("photohash", summary[2]);
    assert.equal(itemPriceInWei, summary[3]);
    assert(!summary[4],"Sale should not be completed when contract is first created");

    assert.equal(accounts[1], creatorAddress, "Owner and creator don't match");
    assert.equal(factory.address, ownerContractAddress);
  });

  it("knows how many sales are deployed", async() => {
    factory = await factoryContract.new();

    itemPriceInWei = web3.toWei('0.001', 'ether');
    await factory.createSale("first item", "description", itemPriceInWei, "photohash", {from:accounts[1]});

    const deployedSalesCount = await factory.getDeployedSalesCount.call();
    assert.equal(1, deployedSalesCount.toNumber());
  });

  it("knows how many transactions has", async() => {
    factory = await factoryContract.new();

    itemPriceInWei = web3.toWei('0.001', 'ether');
    await factory.createSale("first item", "description", itemPriceInWei, "photohash", {from:accounts[1]});
    const saleAddresses = await factory.getDeployedSales.call();
    sale = saleContract.at(saleAddresses[saleAddresses.length - 1]);
    
    await sale.buy({from:accounts[2], value:web3.toWei('0.1', 'ether')});

    const transactionsCount = await factory.getTransactionsCount.call();
    assert.equal(1, transactionsCount.toNumber());
  });

  it("can finalize sale", async() => {
    let creatorAddress = await sale.creator.call();
    let ownerContractAddress = await sale.ownerContract.call();

    printBalance("creator initial balance",creatorAddress);
    const initialCreatorBalance = getBalanceInEth(creatorAddress);

    printBalance("ownerContract initial balance",ownerContractAddress);
    const initialOwnerContractBalance = getBalanceInEth(ownerContractAddress);

    //buy the item
    await sale.buy({from:accounts[2], value:web3.toWei('0.1', 'ether')});

    const isCompleted = await sale.complete.call();
    const finalCreatorBalance = getBalanceInEth(creatorAddress);
    const differenceForCreator = finalCreatorBalance-initialCreatorBalance;

    const finalOwnerContractBalance = getBalanceInEth(ownerContractAddress);
    const differenceForOwnerContract = finalOwnerContractBalance-initialOwnerContractBalance;

    printBalance("creator final balance ",creatorAddress);
    console.log("balance diff for creator is ",differenceForCreator);

    printBalance("ownerContract final balance ",ownerContractAddress);
    console.log("balance diff for ownerContract is ",differenceForOwnerContract);

    assert(isCompleted);
    assert(differenceForCreator<0.001);
    assert(differenceForCreator>0.00085);
    assert.equal(0.0001,differenceForOwnerContract);
  });

  it("cannot finalize sale with lesser amount", async() => {

    try{
      await sale.buy({from:accounts[1], value:'900'});
      assert(false);
    } catch (err){
      assert(err);
    }
  });

  function printBalance(msg,account) {
    const balance = web3.eth.getBalance(account);
    console.log(msg,web3.fromWei(balance, "ether").toNumber());
  }

  function getBalanceInEth(account) {
    const balance = web3.eth.getBalance(account);
    return web3.fromWei(balance, "ether").toNumber();
  }
});
