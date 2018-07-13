import React, {Component} from 'react';
import {Container, Card, Button, Grid, Image, Message} from 'semantic-ui-react';
import Sale from '../ethereum/sale';
import web3 from '../ethereum/web3';

class SaleShow extends Component{
  constructor(props){
    super(props);
    this.state = {
      sale:{},
      loading: false,
      priceInWei: '',
      errorMessage: ''
    }
    this.sale = Sale(props.match.params.saleAddress);
    this.loadSale(props.match.params.saleAddress);
    console.log('sale address ',props.match.params.saleAddress);
  }

  async loadSale(address){

    const summary = await this.sale.methods.getSummary().call();

    this.setState({
        title: summary[0],
        description: summary[1],
        photo: summary[2],
        priceInWei: summary[3],
        completed: summary[4]
    })
  }

  onClick = async (event) => {
    event.preventDefault();
    this.setState({loading:true,errorMessage:''});
    //console.log('clicked');
    try{
      const accounts = await web3.eth.getAccounts();
      await this.sale.methods.buy().send({
        from:accounts[0],
        value: this.state.priceInWei
      });

      // Router.pushRoute('/');
    } catch (err){
      this.setState({errorMessage: err.message});
    }

    this.setState({loading:false});
  };



  render(){

    return (
      <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <Image src={`https://gateway.ipfs.io/ipfs/${this.state.photo}`} />
        </Grid.Column>
        <Grid.Column width={9}>
          <p>Title: {this.state.title}</p>
          <p>Description: {this.state.description}</p>
          <p>Price: {web3.utils.fromWei(this.state.priceInWei, 'ether')} ETH</p>
          <Button
            content="Buy"
            icon="add circle"
            loading={this.state.loading}
            onClick={this.onClick}
          />
          <Message error header="Oops!" content={this.state.errorMessage} />
        </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
export default SaleShow;
