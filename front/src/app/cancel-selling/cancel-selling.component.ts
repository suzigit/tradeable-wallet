import { Component, OnInit } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';
import { DescriptionService } from './../service/description.service';


@Component({
  selector: 'app-cancel-selling',
  templateUrl: './cancel-selling.component.html',
  styleUrls: ['./cancel-selling.component.css']
})
export class CancelSellingComponent implements OnInit {

  selectedAccount: any;  
  tradeableWalletAddress: string;
  priceInGWei: string; 
  operationHash: string;
  description: any;
  errorFront: string;
  errorBack: string;
  percentualFee: string;

  lastTradeableWalletAddress: string;
  isTermsOfServiceChecked: boolean;

  constructor(private blockchainService: BlockchainService, private descriptionService: DescriptionService) { 

      let self = this;
      self.percentualFee = "XX";      

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

  getPriceAndDescription() {

      this.errorFront = undefined;

      if (this.tradeableWalletAddress != this.lastTradeableWalletAddress) {
            this.lastTradeableWalletAddress = this.tradeableWalletAddress;

            let self = this;
            if (this.blockchainService.isAddress(self.tradeableWalletAddress)) {            

                this.blockchainService.getPriceToBuyInGWei(self.tradeableWalletAddress,
                function(result) {
                    console.log("Buy sucess: " + result);
                    if (result>=0) {
                        self.priceInGWei = result;
                    }
                    else {
                        self.priceInGWei = "N/A";
                         self.errorFront = "This Wallet is not available to sell";
                        console.log("Wallet is not available to sell");                        
                    }

                }, function(e) {
                    console.log("Buy error: " + e);
                    self.priceInGWei = "N/A";
                });

                self.description = "";   
                this.blockchainService.getHashDescription(self.tradeableWalletAddress,
                function(hash) {
                    console.log("Hash sucess: " + hash);

                    if (hash) {

                        self.descriptionService.get(hash).subscribe(
                            data => {
                                if (data) {
                                    self.description = data;
                                    console.log("data from ipfs");
                                    console.log(data);

                                }
                                else {
                                    console.log("no data");
                                }
                            },
                            error => {
                                console.log("error getFile");
                                console.log(error);
                            });

                    }  

                }, function(e) {
                    console.log("Hash error: " + e);
                });


                this.blockchainService.getPercentualFee(self.tradeableWalletAddress,
                function(result) {
                    self.percentualFee = result;
                }, function(error) {
                    console.error("could not retrieve percentual fee");
                });


            } //close if checking valid address
      }
  }

  convertPriceToETH() {
      if (this.priceInGWei) {
          
          let pETH = Number(this.priceInGWei)/1000000000;

          if (isNaN(pETH) ) {
            return "N/A";
          }
          else {
              return pETH;
          }
      }
      return "";

  }

  cancelSale() {

        let self = this;
        self.errorFront = undefined;
        self.errorBack = undefined;

        self.operationHash = undefined;

        if (!self.tradeableWalletAddress) {
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

        console.log("All conditions ok - cancelSaleWallet!");            
        
        this.blockchainService.cancelSale(self.tradeableWalletAddress,
        function(result) {
            console.log("sucess: " + result);
            self.operationHash = result;
        }, function(e) {
            console.log("error: " + e);
            self.errorBack = e;
        });
  
  }



}
