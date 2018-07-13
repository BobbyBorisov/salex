import React, {Component} from 'react';
import {Container, Card, Button, Grid, Image, Message, Table} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import TransactionRow from './TransactionRow';

class SaleShow extends Component{
  constructor(props){
    super(props);
    this.state = {
      transactions: [],
      factoryContractBalance: ''
    };
    this.loadTransactions();
    console.log(this.state.transactions);
  }

  async loadTransactions(){

    const transactionsCount = await factory.methods.getTransactionsCount().call();
    const factoryContractBalance = await factory.methods.getBalance().call();

    const transactions = await Promise.all(
      Array(parseInt(transactionsCount)).fill().map((element, index) => {
        return factory.methods.transactions(index).call();
      })
    );

    this.setState({transactions, factoryContractBalance});
  }

  renderRow(){
      return this.state.transactions.map((transaction, index) => {
        return <TransactionRow
                id={index}
                transaction={transaction}
                key={index}
               />;
      });
  }

  render(){
    const {Header, Row, HeaderCell, Body} = Table;

    return (
      <div>
        <h3>Total commission: {web3.utils.fromWei(this.state.factoryContractBalance, 'ether')} in ETH</h3>

        <h3>Transactions list</h3>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Seller Contract</HeaderCell>
              <HeaderCell>Seller Address</HeaderCell>
              <HeaderCell>Buyer Address</HeaderCell>
              <HeaderCell>Value</HeaderCell>
            </Row>
          </Header>
          <Body>
            {this.renderRow()}
          </Body>
        </Table>
        </div>
    );
  }
}
export default SaleShow;
