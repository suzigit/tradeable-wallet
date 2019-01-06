import { Component, OnInit } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';


@Component({
  selector: 'app-new-wallet',
  templateUrl: './new-wallet.component.html',
  styleUrls: ['./new-wallet.component.css']
})
export class NewWalletComponent implements OnInit {

  selectedAccount: any;  
  newTradeableWalletAddress: string;
  errorFront: string;
  errorBack: string;
  isTermsOfServiceChecked: boolean;
  
  
  constructor(private blockchainService: BlockchainService) { 

      let self = this;

      setInterval(function () {

        self.blockchainService.getAccounts().then(accounts =>
        {
            let newSelectedAccount = accounts[0]; 

            if (!newSelectedAccount) {
              self.errorFront = "There is no access to an Ethereum account.";      
            }
            else if (newSelectedAccount !== self.selectedAccount && newSelectedAccount) {
              self.errorFront = "";      
              self.selectedAccount = newSelectedAccount;
              console.log(self.selectedAccount);
            }

        }), 1000});

      this.newTradeableWalletAddress = null;


  }

  ngOnInit() {

  }


  createWallet() {
    let self = this;
    self.errorFront = undefined;
    self.errorBack = undefined;

    self.newTradeableWalletAddress= undefined;

    if (!(this.isTermsOfServiceChecked)) {
      self.errorFront = "You should accept the terms of service";
      return;
    }  
    

      this.blockchainService.createTradeableWallet(
      function(result) {
            self.newTradeableWalletAddress = result;
            console.log("sucess: " + result);
      }, function(error) {
          console.warn("error during contract retrieval nw: " + error);
          self.errorBack = error;
      });

  }

}
