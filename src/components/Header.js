import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import web3 from '../ethereum/web3';
import factory from '../ethereum/factory';

class Header extends Component {
  state = {
    balance:''
  }

  async componentDidUpdate(prevProps){
    if (prevProps.currentAccount !== this.props.currentAccount){
      console.log('new account '+this.props.currentAccount+'. getting balance');
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
            <Link to="/sales/overview"><a className="item">Track Sales</a></Link>
          ) : (<Link to="/new"><a className="item">Add New</a></Link>)}

          <a className="item">Account: {this.props.currentAccount} - Balance {parseFloat(web3.utils.fromWei(this.state.balance,'ether')).toFixed(4)} ETH</a>
        </Menu.Menu>
      </Menu>
    )
  }
};

export default Header;
