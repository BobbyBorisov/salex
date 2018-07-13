import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Home from './components/Home';
import NewSale from './components/NewSale';
import SaleShow from './components/SaleShow';
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
          <Header currentAccount={this.props.provider.currentAccount} contractOwner={this.state.contractOwner}/>
          <Route exact path="/" render={(props) => ( <Home {...props}/> )}/>
          <Route exact path="/new" render={(props) => ( <NewSale {...props} /> )}/>
          <Route path="/sales/overview" render={(props) => ( <SaleShow {...props} /> )}/>
        </Container>
      </Router>
    );
  }
}

export default App;
