import React, {Component} from 'react';
import {Table} from 'semantic-ui-react'
import web3 from '../ethereum/web3';
import utils from '../ethereum/utils';

class TransactionRow extends Component {
  render(){
     const {Row, Cell} = Table;
     const {transaction} = this.props;

     return (
       <Row>
        <Cell>{this.props.id}</Cell>
        <Cell>{utils.cropAfter(transaction.sellerContractAddress,10)}...</Cell>
        <Cell>{transaction.sellerAddress}</Cell>
        <Cell>{transaction.buyerAddress}</Cell>
        <Cell>{web3.utils.fromWei(transaction.value, 'ether')} ETH</Cell>
       </Row>
     );
  }
}

export default TransactionRow;
