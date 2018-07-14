import web3 from './web3';
import SaleFactory from '../contracts/SaleFactory.json';

const instance = new web3.eth.Contract(
  SaleFactory.abi,
  '0x71ecfccae74df617c199bda7a41efb08e029a302'
);

export default instance;
