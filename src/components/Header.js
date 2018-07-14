import React, {Component} from 'react';
import {Menu, Message} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import web3 from '../ethereum/web3';
import utils from '../ethereum/utils';
import EventSystem from '../EventSystem';

class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      balance:''
    }
    console.log(props);
  }

  componentDidMount(){
    EventSystem.subscribe('balance.decrement', async (priceInWei)=>{
      const newBalance = web3.utils.toBN(this.state.balance).sub(web3.utils.toBN(priceInWei));
      this.setState({balance:newBalance});
    });
  }

  async componentDidUpdate(prevProps){

    if ((prevProps.currentAccount !== this.props.currentAccount) && this.props.currentAccount!==null){
      console.log('new account '+this.props.currentAccount+'. fetching balance...');
      const balance = await web3.eth.getBalance(this.props.currentAccount);
      this.setState({balance});
    }
  }

  isOwner(){
    // console.log('currentAccount is ',this.props.currentAccount);
    // console.log('contractOwner is ', this.props.contractOwner)
    return this.props.currentAccount === this.props.contractOwner;
  }

  render(){
    return (
      <div>
      <Menu style={{marginTop:'10px'}}>
          <Link to="/"><a className="item">SaleX</a></Link>

        <Menu.Menu position="left">
          { this.isOwner() ? (

            <Link to="/giveaway"><a className="item">Give away</a></Link>
          ) : null}
          { this.isOwner() ? (
            <Link to="/sales/overview"><a className="item">Track Sales</a></Link>
          ) : null}

          { !this.isOwner() && this.props.currentAccount ? (
            (<Link to="/new"><a className="item">New Sale</a></Link>)
          ) : null}

          {this.props.currentAccount ? (
            <a className="item">{this.isOwner()? 'Owner' : null} Account: {this.props.currentAccount} - Balance {utils.toEtherWithPrecision(this.state.balance,4)} ETH</a>
          ): (<a className="item">No Account</a>)}

        </Menu.Menu>
      </Menu>
      <Message success hidden={this.props.isEthersEnabledBrowser} header="Info" content="Please use Chrome browser and Metamask extension if you want to purchase items" />
      <Message success hidden={!(this.props.isEthersEnabledBrowser && this.props.accountIsLocked)} header="Info" content="Please unlock your account" />
      </div>
    )
  }
};

export default Header;
