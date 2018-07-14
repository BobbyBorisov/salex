import React, {Component} from 'react';
import {Table} from 'semantic-ui-react'

class ParticipantRow extends Component {
  render(){
     const {Row, Cell} = Table;

     return (
       <Row>
        <Cell>{this.props.id}</Cell>
        <Cell>{this.props.address}</Cell>
       </Row>
     );
  }
}

export default ParticipantRow;
