import React, {Component} from 'react';
import {Container, Card, Button, Form, Message, Input} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';

class NewSale extends Component{
  state = {
    title:'',
    description:'',
    photo:'',
    price:'',
    errorMessage: '',
    loading: false
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading:true,errorMessage:''});
    try{
      const accounts = await web3.eth.getAccounts();
      console.log('going to make transaction from',accounts[0]);
      await factory.methods.createSale(this.state.minimumContribution).send({from:accounts[0]});

      //Router.pushRoute('/');
    } catch (err){
      this.setState({errorMessage: err.message});
    }

    this.setState({loading:false});
  };

  render(){
    return (
      <div>
        <h3>Create a sale</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Title</label>
            <Input
              value={this.state.title}
              onChange={event => this.setState({title: event.target.value})}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event => this.setState({description: event.target.value})}
            />
          </Form.Field>
          <Form.Field>
            <label>Price</label>
            <Input
              label="Wei"
              labelPosition="right"
              value={this.state.price}
              onChange={event => this.setState({price: event.target.value})}
            />
          </Form.Field>
          <Form.Field>
            <label>photo hash</label>
            <Input
              value={this.state.photo}
              onChange={event => this.setState({photo: event.target.value})}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>Create!</Button>
        </Form>
        </div>
    );
  }
}
export default NewSale;
