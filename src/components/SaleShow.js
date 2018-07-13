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
      factoryContractBalance: '',
      commissionPercent:''
    };
    this.loadTransactions();
    console.log(this.state.transactions);
  }

  async loadTransactions(){

    const transactionsCount = await factory.methods.getTransactionsCount().call();
    const factoryContractBalance = await factory.methods.getBalance().call();
    const commissionPercent = await factory.methods.commissionPercent().call();

    const transactions = await Promise.all(
      Array(parseInt(transactionsCount)).fill().map((element, index) => {
        return factory.methods.transactions(index).call();
      })
    );

    this.setState({transactions, factoryContractBalance, commissionPercent});
  }

  onClick = async (event, priceInWei,address,index) => {
    event.preventDefault();
    this.setState({loading:true,errorMessage:''});

    try{
      const accounts = await web3.eth.getAccounts();
      await factory.methods.giveAway().send({
        from:accounts[0]
      });

      // Router.pushRoute('/');
    } catch (err){
      this.setState({errorMessage: err.message});
    }

    this.setState({loading:false});
  };

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
        <h3>Commission: {this.state.commissionPercent}%</h3>
        <h3>Total money in contract: {web3.utils.fromWei(this.state.factoryContractBalance, 'ether')} in ETH</h3>
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
