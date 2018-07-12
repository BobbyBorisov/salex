import web3 from './web3';
import SaleFactory from '../contracts/SaleFactory.json';

const instance = new web3.eth.Contract(
  SaleFactory.abi,
  '0xb9b3368984d9b0621f51589763ae1aa60757d01b'
);

export default instance;
