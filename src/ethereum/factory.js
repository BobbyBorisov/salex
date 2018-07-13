import web3 from './web3';
import SaleFactory from '../contracts/SaleFactory.json';

const instance = new web3.eth.Contract(
  SaleFactory.abi,
  '0xc63ced1fc3dbde9b6daf83124423f9c620bca1f2'
);

export default instance;
