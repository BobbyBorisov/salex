import React, {Component} from 'react';
import {Button, Message, Table} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import ParticipantRow from './ParticipantRow';

class Giveaway extends Component{
  constructor(props){
    super(props);
    this.state = {
      giveAwayParticipants: [],
      factoryContractBalance: '',
      loading:false,
      errorMessage: '',
      winner:''
    };
    this.loadParticipants();
  }

  async loadParticipants(){
    const giveAwayParticipants = await factory.methods.getGiveAwayParticipants().call();
    const factoryContractBalance = await factory.methods.getBalance().call();

    this.setState({giveAwayParticipants, factoryContractBalance});
  }

  onClick = async (event, giveAwayPercentage) => {
    event.preventDefault();
    this.setState({loading:true,errorMessage:''});

    try{
      const accounts = await web3.eth.getAccounts();
      await factory.methods.pickWinner(giveAwayPercentage).send({
        from:accounts[0]
      });
      const winner = await factory.methods.lastWinner().call();
      this.setState({winner});
      // Router.pushRoute('/');
    } catch (err){
      console.log(err);
      this.setState({errorMessage: err.message});
    }

    this.setState({loading:false});
  };

  renderRow(){
      return this.state.giveAwayParticipants.map((address, index) => {
        return <ParticipantRow
                id={index}
                address={address}
                key={index}
               />;
      });
  }

  render(){
    const {Header, Row, HeaderCell, Body} = Table;

    return (
      <div>
        <h3>Give away</h3>
        <h3>Total money in contract: {web3.utils.fromWei(this.state.factoryContractBalance, 'ether')} in ETH</h3>
        <div>
          <h3>Give away</h3>
          <Button
            content='10%'
            icon="add circle"
            loading={this.state.loading}
            onClick={event => this.onClick(10)}
            positive
          />
          <Button
            content='25%'
            icon="add circle"
            loading={this.state.loading}
            onClick={event => this.onClick(25)}
            positive
          />
          <Button
            content='50%'
            icon="add circle"
            loading={this.state.loading}
            onClick={event => this.onClick(50)}
            positive
          />
          <Button
            content='100%'
            icon="add circle"
            loading={this.state.loading}
            onClick={event => this.onClick(event,100)}
            positive
          />
          <Message success hidden={this.state.winner === '' ? true: false} header="We have a winner!" content={this.state.winner} />
          <Message error hidden={this.state.errorMessage === '' ? true: false} header="Oops!" content={this.state.errorMessage} />
        </div>
        <h3>Giveaway participants</h3>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Address</HeaderCell>
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
export default Giveaway;
