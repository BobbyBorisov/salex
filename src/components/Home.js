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
    console.log('is ether enabled ',props.provider.isEthersEnabledBrowser());
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

  renderSales(){
    const items = this.state.sales.map((element, index)=>{
      return <Card key={index}>
              <Image style={{'height':200}} src={`https://gateway.ipfs.io/ipfs/${element[2]}`} />
              <Card.Content>
                <Card.Header>{element[0]}</Card.Header>
                <Card.Meta>
                  <span className='date'>Joined in 2015</span>
                </Card.Meta>
                <Card.Description>{element[1]}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                { element[4] ?
                  <Button
                    content="Sold"
                    disabled
                    fluid
                  />:
                  <Button
                    content={`Buy for ${utils.toEtherWithPrecision(element[3],3)} ETH`}
                    icon="add circle"
                    loading={this.state.loading}
                    onClick={event => this.onClick(event,element[3], element[5],index)}
                    disabled={element[4] || !this.props.provider.isEthersEnabledBrowser()}
                    fluid
                    positive
                  />
                }

              </Card.Content>
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
