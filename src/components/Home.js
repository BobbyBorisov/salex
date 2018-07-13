import React, {Component} from 'react';
import {Container, Card, Button} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import { Link } from 'react-router-dom';


class Home extends Component{
  constructor(props){
    super(props);
    this.state = {
      sales: []
    }
    this.loadSales();
    console.log(this.state.sales);
  }

  async loadSales(){
      const sales = await factory.methods.getDeployedSales().call();
      this.setState({
          sales: sales
      })
  }

  renderSales(){
    const items = this.state.sales.map(address=>{
      return {
        header: address,
        description: <Link to={`/sale/${address}`}>View</Link>,
        fluid: true
      };
    });

    return <Card.Group items={items}/>;
  }

  render(){

    return (
      <div>
          <h3>Open sales</h3>
          {this.renderSales()}
          <Button
            content="Create Sale"
            icon="add circle"
            floated="right"
            primary
          />
      </div>
    );
  }
}
export default Home;
