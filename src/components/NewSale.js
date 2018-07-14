import React, {Component} from 'react';
import {Button, Form, Message, Input} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import ipfs from '../ethereum/ipfs';
import utils from '../ethereum/utils';

class NewSale extends Component{
  state = {
    title:'',
    description:'',
    photo:'',
    price:'',
    buffer:'',
    errorMessage: '',
    loading: false
  }

  captureFile =(event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)
  };

  convertToBuffer = async(reader) => {
      //file is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.setState({buffer});
  };

  uploadPhoto = async () => {
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err,ipfsHash);
      this.setState({ photo:ipfsHash[0].hash });
    })
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading:true,errorMessage:''});

    try{
      const accounts = await web3.eth.getAccounts();
      //console.log('going to create new sale from '+accounts[0]+' with price '+this.state.price+'Wei, '+utils.toWei(this.state.price)+' ETH');

      const hash = await ipfs.add(this.state.buffer);
      this.setState({photo:hash[0].hash});

      await factory.methods.createSale(this.state.title, this.state.description, utils.toWei(this.state.price), this.state.photo).send({from:accounts[0]});
      this.props.history.push('/');
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
              label="ETH"
              labelPosition="right"
              value={this.state.price}
              onChange={event => this.setState({price: event.target.value})}
            />
          </Form.Field>
          <Form.Field>
            <label>photo</label>
            <Input
              type="file"
              onChange={this.captureFile}
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
