import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Home from './components/Home';
import NewSale from './components/NewSale';
import SaleShow from './components/SaleShow';
import Giveaway from './components/Giveaway';
import {Container} from 'semantic-ui-react';
import Header from './components/Header';
import factory from './ethereum/factory';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      contractOwner:''
    }
    this.loadOwner();
  }

  async loadOwner(){
    const contractOwner = await factory.methods.manager().call();
    this.setState({contractOwner});
  }

  render() {
    return (
      <Router>
        <Container>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"></link>
          <Header currentAccount={this.props.provider.currentAccount} isEthersEnabledBrowser={this.props.provider.isEthersEnabledBrowser()} accountIsLocked={this.props.provider.accountIsLocked()} contractOwner={this.state.contractOwner}/>
          <Route exact path="/" render={(props) => ( <Home {...props} provider={this.props.provider}/> )}/>
          <Route exact path="/new" render={(props) => ( <NewSale {...props} /> )}/>
          <Route path="/sales/overview" render={(props) => ( <SaleShow {...props} /> )}/>
          <Route path="/giveaway" render={(props) => ( <Giveaway {...props} /> )}/>
        </Container>
      </Router>
    );
  }
}

export default App;
