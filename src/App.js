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


class App extends Component {
  constructor(props){
    super(props);
    console.log("component constructor created");
    // console.log("current account is :",this.props.provider.currentAccount);
  }

  componentDidUpdate(prevProps){
    // console.log('component updated');
    // console.log('prevprops ' ,prevProps);
    // console.log('prevacc ' ,prevProps.provider.currentAccount);
    // console.log('newprops', this.props);
    // console.log('newacc', this.props.provider.currentAccount);
  }

  render() {
    return (
      <Router>
        <Container>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"></link>
          <Header currentAccount={this.props.provider.currentAccount}/>
          <Route exact path="/" render={(props) => ( <Home {...props}/> )}/>
          <Route exact path="/new" render={(props) => ( <NewSale {...props} /> )}/>
          <Route path="/sales/overview" render={(props) => ( <SaleShow {...props} /> )}/>
        </Container>
      </Router>
    );
  }
}

export default App;
