import web3 from './web3';
import SaleFactory from '../contracts/SaleFactory.json';

const instance = new web3.eth.Contract(
  SaleFactory.abi,
  '0x609988a0bc218965d37569e678e564d583298a3c'
);

export default instance;
