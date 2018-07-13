import React, {Component} from 'react';
import {Table, Button} from 'semantic-ui-react'
import web3 from '../ethereum/web3';
import utils from '../ethereum/utils';

class ParticipantRow extends Component {
  render(){
     const {Row, Cell} = Table;
     const {transaction} = this.props;

     return (
       <Row>
        <Cell>{this.props.id}</Cell>
        <Cell>{this.props.address}</Cell>
       </Row>
     );
  }
}

export default ParticipantRow;
