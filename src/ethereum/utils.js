import web3 from './web3';

export default module.export = {
  toWei(value){
    return web3.utils.toWei(value,'ether');
  },

  toEther(value){
    return web3.utils.fromWei(value,'ether');
  },

  toEtherWithPrecision(value, precision){
    return parseFloat(this.toEther(value)).toFixed(precision);
  },
  
  cropAfter(text,index){
    return text.substring(0, index);
  }
};
