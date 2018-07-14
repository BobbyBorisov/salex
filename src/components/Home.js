import React, {Component} from 'react';
import {Card, Button, Image} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Sale from '../ethereum/sale';
import web3 from '../ethereum/web3';
import utils from '../ethereum/utils';
import EventSystem from '../EventSystem';

class Home extends Component{
  constructor(props){
    super(props);
    console.log('is ether enabled browser',props.provider.isEthersEnabledBrowser());
    console.log('account is locked ',props.provider.accountIsLocked());
    this.state = {
      sales: [],
      loading:false,
      errorMessage:''
    }
    this.loadSales();
  }

  async loadSales(){
      const salesAddresses = await factory.methods.getDeployedSales().call();

      const salesSummary = await Promise.all(
        salesAddresses.map((address, index) => {
          let sale = Sale(address);
          return sale.methods.getSummary().call();
        })
      );

      this.setState({
          sales: salesSummary
      })
  }

  onClick = async (event, priceInWei,address,index) => {
    event.preventDefault();
    this.setState({loading:true,errorMessage:''});

    try{
      const accounts = await web3.eth.getAccounts();
      let sale = Sale(address);
      await sale.methods.buy().send({
        from:accounts[0],
        value: priceInWei
      });

      // Router.pushRoute('/');
      this.state.sales[index][4] = true;
      this.forceUpdate();
      EventSystem.publish('balance.decrement',priceInWei);
    } catch (err){
      this.setState({errorMessage: err.message});
    }

    this.setState({loading:false});
  };

  renderButton(isSaleCompleted, sellerAddress, priceInWei, contractAddress, index){
    if(sellerAddress === this.props.provider.currentAccount){
      return null;
    }else if(isSaleCompleted){
      return <Card.Content extra><Button
              content="Sold"
              disabled
              fluid
            /></Card.Content>
    }else{
      return <Card.Content extra><Button
        content={`Buy for ${utils.toEtherWithPrecision(priceInWei,3)} ETH`}
        loading={this.state.loading}
        onClick={event => this.onClick(event,priceInWei, contractAddress,index)}
        disabled={!this.props.provider.isEthersEnabledBrowser() || this.props.provider.accountIsLocked()}
        fluid
        positive
      /></Card.Content>
    }
  }

  renderSales(){
    const items = this.state.sales.map((element, index)=>{
      return <Card key={index}>
              <Image style={{'height':200}} src={`https://gateway.ipfs.io/ipfs/${element[2]}`} />
              <Card.Content>
                <Card.Header>{element[0]}</Card.Header>
                <Card.Meta>
                { this.props.provider.isEthersEnabledBrowser() && !this.props.provider.accountIsLocked() ?
                  (<div>
                    <div>
                      <span className='date'>Seller: {utils.cropAfter(element[6],15)} ...</span>
                    </div>
                    <div>
                      <span className='date'>Contract: {utils.cropAfter(element[5],13)} ...</span>
                    </div>
                  </div>) : null
                }
                </Card.Meta>
                <Card.Description>{element[1]}</Card.Description>
              </Card.Content>

                {this.renderButton(element[4],element[6],element[3],element[5],index)}

            </Card>
    });

    return items;
  }

  render(){

    return (
      <div>
          <h3>All Sales</h3>
          <Card.Group itemsPerRow="5">
            {this.renderSales()}
          </Card.Group>
      </div>
    );
  }
}
export default Home;
