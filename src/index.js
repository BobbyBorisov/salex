import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import ClientProvider from './ethereum/ClientProvider.js';

console.log('iniital ', ClientProvider.currentAccount);

ReactDOM.render(<App />, document.getElementById('root'));

ClientProvider.onMetamaskAccountChange(() => {
    console.log('change', ClientProvider.currentAccount);
    ReactDOM.render(<App provider={ClientProvider} account={ClientProvider.currentAccount}
                         ethBrowser={ClientProvider.isEthersEnabledBrowser()}/>, document.getElementById("root"))
});

registerServiceWorker();
