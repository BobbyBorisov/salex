import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import web3 from '../ethereum/web3';
import factory from '../ethereum/factory';
import utils from '../ethereum/utils';
import EventSystem from '../EventSystem';

class Header extends Component {
  state = {
    balance:''
  }

  componentDidMount(){
    EventSystem.subscribe('balance.decrement', async (priceInWei)=>{
      const newBalance = web3.utils.toBN(this.state.balance).sub(web3.utils.toBN(priceInWei));
      this.setState({balance:newBalance});
    });
  }

  async componentDidUpdate(prevProps){
    if (prevProps.currentAccount !== this.props.currentAccount){
      console.log('new account '+this.props.currentAccount+'. fetching balance...');
      const balance = await web3.eth.getBalance(this.props.currentAccount);
      this.setState({balance});
    }
  }

  isOwner(){
    console.log('currentAccount is ',this.props.currentAccount);
    console.log('contractOwner is ', this.props.contractOwner)
    return this.props.currentAccount === this.props.contractOwner;
  }

  render(){
    return (
      <Menu style={{marginTop:'10px'}}>
          <Link to="/"><a className="item">SaleX</a></Link>

        <Menu.Menu position="right">
          { this.isOwner() ? (

            <Link to="/giveaway"><a className="item">Give away</a></Link>
          ) : null}
          { this.isOwner() ? (
            <Link to="/sales/overview"><a className="item">Track Sales</a></Link>
          ) : (<Link to="/new"><a className="item">Add New</a></Link>)}

          <a className="item">Account: {this.props.currentAccount} - Balance {utils.toEtherWithPrecision(this.state.balance,4)} ETH</a>
        </Menu.Menu>
      </Menu>
    )
  }
};

export default Header;
