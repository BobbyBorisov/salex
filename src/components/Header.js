import React from 'react';
import {Menu} from 'semantic-ui-react';
import {Link} from "react-router-dom";

export default (props) => {
  return (
    <Menu style={{marginTop:'10px'}}>
        <Link to="/"><a className="item">SaleX</a></Link>

      <Menu.Menu position="right">
        <Link to="/sales"><a className="item">View Sales</a></Link>
        <Link to="/new"><a className="item">Add New</a></Link>
        <a className="item">Account: {props.currentAccount}</a>
      </Menu.Menu>
    </Menu>
  )
};
