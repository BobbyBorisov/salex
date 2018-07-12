import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  //We are in the browser and metamask is running.
  web3 = new Web3(window.web3.currentProvider);
  console.log('we are in the browser');
} else {
  //We are on the server *OR* the user is not running metamask.
  const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/1gI9DT8OOfMzWzoF21xH');
  web3 = new Web3(provider);
  console.log('we are on the server or user is not running metamask');
}

export default web3;
