import Web3 from 'web3';

class ClientProvider{
    constructor(){
        this.web3Provider = this.determineProvider();

        if (this.isEthersEnabledBrowser()){
            console.log('ethereum browser enabled');
            this.watchMetamaskInterval = setInterval(this.watchMetamask.bind(this), 200);
        }
    }

    determineProvider(){
      console.log('determining web3 provider');
      if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
        //We are in the browser and metamask is running.
        console.log('using injected web3 provider');
        return new Web3(window.web3.currentProvider);
      } else {
        //We are on the server *OR* the user is not running metamask.
        // const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/1gI9DT8OOfMzWzoF21xH');
        // console.log('using rinkeby web3 provider');

        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
        console.log('using ganache as providers');
        return new Web3(provider);
      }
    }

    isEthersEnabledBrowser(){
        return typeof window !== 'undefined' && typeof window.web3 !== 'undefined';
    }

    accountIsLocked(){
        return this.currentAccount == null;
    }

    onMetamaskAccountChange(callback){
        window.document.addEventListener('metamaskAccountChanged', function (customEvent) {
            callback(customEvent);
        });
    }



    async watchMetamask(){
        console.log('watching metamask');
        const accounts = await this.web3Provider.eth.getAccounts();
        if (accounts.length > 0){
            //console.log('found acc');
            if (this.currentAccount !== accounts[0]){
                this.currentAccount = accounts[0];
                window.document.dispatchEvent(new CustomEvent('metamaskAccountChanged', {'detail': {'account': this.currentAccount}}));
            }
        } else {
           //console.log('no acc');
            if (this.currentAccount){
                this.currentAccount = null;
                window.document.dispatchEvent(new CustomEvent('metamaskAccountChanged', {'detail': {'account': this.currentAccount}}));
            }
        }
    }
    async getBalance(){
        if (!this.currentAccount){
            return null;
        }
        const balance = await this.provider.getBalance(this.currentAccount);
        return balance;
    }
}

export default new ClientProvider;
