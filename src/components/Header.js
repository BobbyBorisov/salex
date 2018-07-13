import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import web3 from '../ethereum/web3';

class Header extends Component {
  state = {
    balance:''
  }

  async componentDidUpdate(prevProps){
    console.log('component did update');
    if (prevProps.currentAccount !== this.props.currentAccount){
      console.log('new account '+this.props.currentAccount+'. getting balance');
      const balance = await web3.eth.getBalance(this.props.currentAccount);
      this.setState({balance});
    }
  }
  render(){
    return (
      <Menu style={{marginTop:'10px'}}>
          <Link to="/"><a className="item">SaleX</a></Link>

        <Menu.Menu position="right">
          <Link to="/sales"><a className="item">View Sales</a></Link>
          <Link to="/new"><a className="item">Add New</a></Link>
          <a className="item">Account: {this.props.currentAccount} - Balance {parseFloat(web3.utils.fromWei(this.state.balance,'ether')).toFixed(4)} ETH</a>
        </Menu.Menu>
      </Menu>
    )
  }
};

export default Header;
