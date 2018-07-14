pragma solidity ^0.4.0;

import './SaleFactory.sol';

contract Sale {
    uint public price;
    string public title;
    string public description;
    string public photoHash;
    bool public complete;

    uint commissionPercent;
    address public ownerContract;
    address public creator;

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

    function getSummary() public view returns (string, string, string, uint, bool,address, address) {
        return (
            title,
            description,
            photoHash,
            price,
            complete,
            this,
            creator
        );
    }
}
