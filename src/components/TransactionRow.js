import React, {Component} from 'react';
import {Table, Button} from 'semantic-ui-react'
import web3 from '../ethereum/web3';

class TransactionRow extends Component {
  render(){
     const {Row, Cell} = Table;
     const {transaction} = this.props;

     return (
       <Row>
        <Cell>{this.props.id}</Cell>
        <Cell>{transaction.sellerContractAddress}</Cell>
        <Cell>{transaction.sellerAddress}</Cell>
        <Cell>{transaction.buyerAddress}</Cell>
        <Cell>{web3.utils.fromWei(transaction.value, 'ether')} ETH</Cell>
       </Row>
     );
  }
}

export default TransactionRow;
