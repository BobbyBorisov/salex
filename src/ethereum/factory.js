import web3 from './web3';
import SaleFactory from '../contracts/SaleFactory.json';

const instance = new web3.eth.Contract(
  SaleFactory.abi,
  '0xf9361b2825c1e753e2ded65875722e7bc40e2c48'
);

export default instance;
