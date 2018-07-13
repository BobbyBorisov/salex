import React, {Component} from 'react';
import {Container, Card, Button, Image, Icon, Message} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import { Link } from 'react-router-dom';
import Sale from '../ethereum/sale';
import web3 from '../ethereum/web3';

class Home extends Component{
  constructor(props){
    super(props);
    this.state = {
      sales: [],
      loading:false,
      errorMessage:''
    }
    this.loadSales();
    console.log(this.state.sales);

    // const sales = await Promise.all(
    //   Array(parseInt(salesCount)).fill().map((element, index) => {
    //     return sale.methods.requests(index).call();
    //   })
    // );
  }

  async loadSales(){
      const salesAddresses = await factory.methods.getDeployedSales().call();
      console.log(salesAddresses);

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
    } catch (err){
      this.setState({errorMessage: err.message});
    }

    this.setState({loading:false});
  };

  renderSales(){
    console.log(this.state.sales);
    const items = this.state.sales.map((element, index)=>{
      console.log("element ",element);
      console.log("index ",index);

      // return {
      //   image: <Image style={{'height':200}} src={`https://gateway.ipfs.io/ipfs/${element[2]}`}/>,
      //   header: element[0],
      //   description: element[1],
      // };

      return <Card key={index}>
              <Image style={{'height':200}} src={`https://gateway.ipfs.io/ipfs/${element[2]}`} />
              <Card.Content>
                <Card.Header>{element[0]} ({element[4] ? 'Sold' : ''})</Card.Header>
                <Card.Meta>
                  <span className='date'>Joined in 2015</span>
                </Card.Meta>
                <Card.Description>{element[1]}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button
                  content={`Buy for ${element[3]} WEI`}
                  // content={`Buy for ${web3.utils.fromWei(element[3], 'ether')} ETH`}
                  icon="add circle"
                  loading={this.state.loading}
                  onClick={event => this.onClick(event,element[3], element[5],index)}
                  disabled={element[4]}
                />

              </Card.Content>
            </Card>
    });

    return items;
  }

  render(){

    return (
      <div>
          <h3>Open sales</h3>
          <Card.Group>
            {this.renderSales()}
          </Card.Group>
      </div>
    );
  }
}
export default Home;
