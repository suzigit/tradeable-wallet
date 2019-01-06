import { Component, OnInit } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';


@Component({
  selector: 'app-withdraw-tokens',
  templateUrl: './withdraw-tokens.component.html',
  styleUrls: ['./withdraw-tokens.component.css']
})
export class WithdrawTokensComponent implements OnInit {

  selectedAccount: any;  
  tradeableWalletAddress: string;
  tokensAddress: string;
  numberOfTokens: number; //TODO: Deal with floating point
  newWithdrawHash: string;
  errorFront: string;
  errorBack: string;
  isTermsOfServiceChecked: boolean;
  sBalance: string;

  
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

   }


    getTokensBalance() {

        console.log("getTokensBalance");

        if (!this.blockchainService.isAddress(this.tradeableWalletAddress)) {
            this.errorFront = "It is not a valid address - Tradeable Wallet";
            console.log("Invalid Address");
            return;
        }        
        if (!this.blockchainService.isAddress(this.tokensAddress)) {
            this.errorFront = "It is not a valid address - Token Address";
            console.log("Invalid Address");
            return;
        }        


        let self = this;
        this.blockchainService.getTokenBalanceOf(self.tradeableWalletAddress,self.tokensAddress,
            function(result) {
                console.log(result);
                self.sBalance = result;
                self.errorFront = undefined;

            }, function(e) {
                self.sBalance = "N/A";
                self.errorFront = "It was not possible to recover the token balance";
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
                self.errorFront = "It was not possible to verify if this wallet is available to sell. Maybe it is not a Tradeable Wallet";
                console.log("getInfoError: " + e);
            });   
        
        
    }


    ngOnInit() {
    }

    withdrawTokens(){

        let self = this;
        self.errorFront = undefined;
        self.errorBack = undefined;
        self.newWithdrawHash = undefined;

        console.log("withdrawTokens");

        if (!(self.tradeableWalletAddress && self.tokensAddress && (self.numberOfTokens || self.numberOfTokens===0))) {
            self.errorFront = "All fields are required";
            return;
        } 
        if (!(this.blockchainService.isAddress(self.tradeableWalletAddress))) {
            self.errorFront = "It is not a valid address - Tradeable Wallet";
            return;
        }
        if (!(this.blockchainService.isAddress(self.tokensAddress))) {
            self.errorFront = "It is not a valid address - Token Address";
            return;
        }
        if (!(this.isTermsOfServiceChecked)) {
          self.errorFront = "You should accept the terms of service";
          return;
        }  
        
        console.log("All conditions ok - withdrawTokens!");            
            

        if (this.isTermsOfServiceChecked) {
            this.blockchainService.withdrawTokens(self.tradeableWalletAddress, self.tokensAddress, self.numberOfTokens,
            function(result) {
                console.log("withdraw sucess!");
                console.log(result);
                self.newWithdrawHash = result;
            }, function(e) {
                console.log("withdraw  error: " + e);
                self.errorBack = e;
            });


        }



    }


}
