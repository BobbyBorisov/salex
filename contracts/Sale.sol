pragma solidity ^0.4.0;

contract SaleFactory{
    address[] public deployedSales;
    uint public commissionPercent;

    constructor() public {
        commissionPercent = 10;
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
    }

    function getSummary() public view returns (string, string, string, uint, bool) {
        return (
            title,
            description,
            photoHash,
            price,
            complete
        );
    }

    function sendHash(string _photoHash) public restricted {
        photoHash = _photoHash;
    }
}
