import web3 from './web3';
import SaleFactory from '../contracts/SaleFactory.json';

const instance = new web3.eth.Contract(
  SaleFactory.abi,
  '0xc692c92d66db552efc79dfb84de731a8045e8f02'
);

export default instance;
