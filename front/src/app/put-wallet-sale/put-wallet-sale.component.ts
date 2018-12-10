import { Component, OnInit } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';
import { DescriptionService } from './../service/description.service';



@Component({
  selector: 'app-put-wallet-sale',
  templateUrl: './put-wallet-sale.component.html',
  styleUrls: ['./put-wallet-sale.component.css']
})
export class PutWalletSaleComponent implements OnInit {

  selectedAccount: any;  
  tradeableWalletAddress: string;
  priceInGWei: string; //TODO: Deal with floating point
  newSellHash: string;
  errorFront: string;
  errorBack: string;
  description: any;
  hashDescription: string;
  errorSaveDescription: string;
  percentualFee: string;
  isTermsOfServiceChecked: boolean;
  lastTradeableWalletAddress: string;
  

  
  constructor(private blockchainService: BlockchainService, private descriptionService: DescriptionService ) { 

      let self = this;

      self.percentualFee = "XX";
      self.hashDescription = "";

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


  saveDescription() {

    let self = this;
    self.hashDescription = "";
    self.errorSaveDescription = "";

    if (this.description) {

        this.descriptionService.save(this.description).subscribe(
            data => {
                if (data) {
                    console.log("hash=" + data["Hash"]);
                    self.hashDescription = data["Hash"];
                }
                else {
                    self.errorSaveDescription = "No data";
                    console.log("no data");
                }
            },
            error => {
                self.errorSaveDescription = error;
                console.log("Erro ao inserir dado - excecao");
                console.log("error");

            });

    }
    
  
  }

 getWalletInfo() {

       this.errorFront = undefined;

       let self = this;


      if (this.tradeableWalletAddress != this.lastTradeableWalletAddress) {
            this.lastTradeableWalletAddress = this.tradeableWalletAddress;

            let self = this;

            if (!this.blockchainService.isAddress(self.tradeableWalletAddress)) {
                this.errorFront = "It is not a valid address - Tradeable Wallet";
                console.log("Invalid Address");
                return;
            }        
            
            this.blockchainService.getPriceToBuyInGWei(self.tradeableWalletAddress,
            function(result) {
                console.log("Buy sucess: " + result);
                if (result>=0) {
                    self.priceInGWei = result;
                }
                else {
                    self.priceInGWei = "N/A";
                    self.errorFront = "This Tradeable Wallet is not available to sell.";
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
                                self.hashDescription = hash;
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
            self.percentualFee = "XX";
            self.errorFront = "It was not possible to recover the Percentual Fee of this address. Maybe it is not a Tradeable Wallet.";
            console.error("could not retrieve percentual fee");
        });
 
      }
 }





  sale() {

        let self = this;
        self.errorFront = undefined;
        self.errorBack = undefined;
        self.newSellHash = undefined;

        if (!(self.tradeableWalletAddress && self.priceInGWei)) {
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

        console.log("All conditions ok - put wallet for sale!");          
        console.log(self);          

        let price = +self.priceInGWei;  

        this.blockchainService.setAvailableToSell(self.tradeableWalletAddress, price,
        self.hashDescription, function(result) {
            console.log("sell sucess: " + result);
            self.newSellHash = result;
        }, function(e) {
            console.log("sell  error: " + e);
            self.errorBack = e;           
        });

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

}
