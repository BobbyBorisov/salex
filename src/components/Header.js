import React from 'react';
import {Menu} from 'semantic-ui-react';


export default () => {
  return (
    <Menu style={{marginTop:'10px'}}>
        <a className="item">Ethx</a>
      <Menu.Menu position="right">
        <a className="item">Sales</a>
        <a className="item">+</a>
      </Menu.Menu>
    </Menu>
  )
};
