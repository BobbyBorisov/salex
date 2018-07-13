pragma solidity ^0.4.0;

contract SaleFactory{
    struct Transaction {
        address sellerAddress;
        address sellerContractAddress;
        address buyerAddress;
        uint value;
    }

    Transaction[] public transactions;
    address[] public deployedSales;
    uint public commissionPercent;
    address public manager;

    constructor() public {
        commissionPercent = 10;
        manager = msg.sender;
    }

    function createSale(string title, string description,uint price,  string photoHash) public {
        address newSale = new Sale(title, description, price , photoHash,commissionPercent, msg.sender);
        deployedSales.push(newSale);
    }

    function getDeployedSales() public view returns(address[]){
        return deployedSales;
    }

    function getDeployedSalesCount() public view returns(uint){
      return deployedSales.length;
    }

    function getBalance() public view returns(uint){
        return this.balance;
    }

    function recordTransaction(address _sellerAddress, address _buyerAddress, address _sellerContractAddress, uint value){
        Transaction memory newTransaction = Transaction({
           sellerAddress: _sellerAddress,
           sellerContractAddress: _sellerContractAddress,
           buyerAddress: _buyerAddress,
           value: value
        });

        transactions.push(newTransaction);
    }

    function getTransactionsCount() public view returns(uint){
        return transactions.length;
    }

    function() payable {
    }
}

contract Sale {
    uint public price;
    string public title;
    string public description;
    string public photoHash;
    bool public complete;

    uint commissionPercent;
    address public ownerContract;
    address public creator;

    modifier restricted(){
        require(msg.sender == creator);
        _;
    }

    constructor(string _title,string  _description,uint _price, string  _photoHash, uint _commissionPercent, address _creator) public {
        title = _title;
        description = _description;
        price = _price;
        photoHash = _photoHash;
        commissionPercent = _commissionPercent;
        creator = _creator;
        ownerContract = msg.sender;
        complete = false;
    }

    function buy() public payable {
        require(msg.value >= price);
        uint commisionValue = (commissionPercent*price)/100;
        ownerContract.send(commisionValue);
        creator.transfer(price-commisionValue);
        complete=true;
        SaleFactory factory = SaleFactory(ownerContract);
        factory.recordTransaction(creator, msg.sender, this, price);
    }

    function getSummary() public view returns (string, string, string, uint, bool,address) {
        return (
            title,
            description,
            photoHash,
            price,
            complete,
            this
        );
    }

    function sendHash(string _photoHash) public restricted {
        photoHash = _photoHash;
    }
}
