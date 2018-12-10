import { Component, OnInit } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';

@Component({
  selector: 'app-withdraw-eth',
  templateUrl: './withdraw-eth.component.html',
  styleUrls: ['./withdraw-eth.component.css']
})
export class WithdrawEthComponent implements OnInit {

  selectedAccount: any;  
  tradeableWalletAddress: string;
  newWithdrawHash: string;
  errorFront: string;
  errorBack: string;
  isTermsOfServiceChecked: boolean;
  valueInGWei: number; 
  sBalance: string;


  constructor(private blockchainService: BlockchainService) { 

      let self = this;

      setInterval(function () {

        self.blockchainService.getAccounts().then(accounts =>
        {
            let newSelectedAccount = accounts[0]; 

            if (newSelectedAccount !== self.selectedAccount && newSelectedAccount) {
              self.selectedAccount = newSelectedAccount;
              console.log(self.selectedAccount);
            }
        }), 1000});

   }


  ngOnInit() {
  }

 getEthBalance() {

    console.log("getEthBalance");

     let self = this;
     this.blockchainService.getEthBalance(self.tradeableWalletAddress,
        function(result) {
            console.log(result);
            self.sBalance = result;
        }, function(e) {
            self.errorFront = "It was not possible to recover the balance of this address. Maybe it is not a Tradeable Wallet.";
            console.log("Balance Error: " + e);
        });   
  }

    getWalletInfo() {

        console.log("getWalletInfo");
        
         this.errorFront = undefined;

        if (!this.blockchainService.isAddress(this.tradeableWalletAddress)) {
            this.errorFront = "It is not a valid address - Tradeable Wallet";
            console.log("Invalid Address");
            return;
        }        

        this.getEthBalance();

        let self = this;
        self.errorFront = "";
        self.errorBack = "";

        this.blockchainService.getInfoIfIsAvailableToSell(self.tradeableWalletAddress,
            
            function(isAvailableToSell) {
                
                if (isAvailableToSell) {
                    self.errorFront = "It is not possible to withdraw when the wallet is available to sell";
                }
                else {
                    console.log("fSucess else");

                    self.blockchainService.getTotalBlocksToFinishFrontRunningRiskExternal(self.tradeableWalletAddress,

                                function(result) {
                                console.log("result=" + result);

                                    if (result!=0) {
                                        self.errorFront = "You still have to wait " + result + " blocks before be able to withdraw";
                                    }
                                    else {
                                        console.log("it is possible to withdraw");
                                        
                                    }

                                }, 
                                function(e) {
                                    console.log("erro aninhado");

                                   console.log("getTotalBlocksError: " + e);
                                }
                    );  //close  getTotalBlocksToFinishFrontRunningRiskExternal

                    console.log("fim fSucess else");


                    } //close else
               },
            function(e) {
                console.log("getInfoError: " + e);
            });   
        
        
    }
 

  withdrawEth(){

        let self = this;
        self.errorFront = undefined;
        self.errorBack = undefined;
        self.newWithdrawHash = undefined;

        console.log("withdrawEth");

        if (!(self.tradeableWalletAddress && (self.valueInGWei || self.valueInGWei===0))) {
          self.errorFront = "All fields are required";
          return;        
        }
        if (!(this.blockchainService.isAddress(self.tradeableWalletAddress))) {
            self.errorFront = "It is not a valid address - Tradeable Wallet";
            return;
        }
        if (!(this.isTermsOfServiceChecked)) {
          self.errorFront = "You should accept the terms of service";
          return;
        }  

        console.log("All conditions ok - withdrawEth!");            

        this.blockchainService.withdrawEth(self.tradeableWalletAddress, self.valueInGWei,
        function(result) {
            console.log("withdraw sucess!");
            console.log(result);
            self.newWithdrawHash = result;
            self.sBalance = "";    
        }, function(e) {
            console.log("withdraw  error: " + e);
            self.errorBack = e;
        });

  }

  convertToETH() {

      if (this.valueInGWei) {
          
          let pETH = Number(this.valueInGWei)/1000000000;

          if (isNaN(pETH) ) {
            return "N/A";
          }
          else {
              return pETH;
          }
      }
      return "";

  }


}
