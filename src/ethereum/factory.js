import web3 from './web3';
import SaleFactory from '../contracts/SaleFactory.json';

const instance = new web3.eth.Contract(
  SaleFactory.abi,
  '0xe8bdfe09d2a209ba5f71cbda55ef05429a1168db'
);

export default instance;
