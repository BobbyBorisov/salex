pragma solidity ^0.4.0;

import './Sale.sol';

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
    address[] public giveAwayParticipants;
    address public lastWinner;

    constructor() public {
        commissionPercent = 10;
        manager = msg.sender;
    }

    modifier restricted(){
        require(msg.sender == manager);
        _;
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

        if(value >= .01 ether){
            giveAwayParticipants.push(_buyerAddress);
        }
    }

    function getTransactionsCount() public view returns(uint){
        return transactions.length;
    }

    function random() private view returns (uint){
        return uint(keccak256(block.difficulty, now, giveAwayParticipants));
    }

    function pickWinner(uint percentage) public restricted{
        uint index = random() % giveAwayParticipants.length;
        uint amount = (percentage*this.balance)/100;
        giveAwayParticipants[index].transfer(amount);
        lastWinner = giveAwayParticipants[index];
        giveAwayParticipants = new address[](0);
    }

    function getGiveAwayParticipants() public view returns(address[]){
        return giveAwayParticipants;
    }

    function() payable {
    }
}
