import web3 from './web3';
import Sale from '../contracts/Sale.json';

export default (address) => {
  return new web3.eth.Contract(
    Sale.abi,
    address
  );
};
