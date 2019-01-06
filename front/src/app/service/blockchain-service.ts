import { Injectable, Output, EventEmitter } from '@angular/core';

import {Contract} from './Contract';
import {BlockchainConnectionError} from './blockchain-connection-error';

declare let require: any;

declare let window: any;

const Web3 = require('web3');
var Accounts = require('web3-eth-accounts');
var Web3Utils = require('web3-utils');

import * as Constants from './../../../Constants.json';
import * as ContractCreatorAddress from './../../../ContractCreatorAddress.json';

import * as contractCreatortMetadata from  './../../../ContractCreator.json';
import * as interfaceTradeableContractMetadata from './../../../ITradeableContract.json';



@Injectable()
export class BlockchainService {

    private contractCreator: any;
    private web3: any;


    constructor() {

        this.createWeb3();
        this.createInitialObjects();

    }

    isAddress(text) {
        return this.web3.utils.isAddress(text);
    }

    createWeb3() {

        if (typeof window.web3 !== 'undefined') {
             // Use Mist/MetaMask's provider
            this.web3 = new Web3(window.web3.currentProvider);

        } else {
            throw new BlockchainConnectionError('Please use a dapp browser like mist or MetaMask plugin for chrome');
        }

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];
            if (selectedAccount==undefined) {
                throw new BlockchainConnectionError('No Ethereum account selected');
            } 
        }).catch (error => 
        {
            throw new BlockchainConnectionError('No access to Ethereum account');
        });

    }

    createInitialObjects() {

        this.contractCreator = new Contract();
        this.contractCreator.address =  (<any>ContractCreatorAddress).ContractCreatorAddress;
        this.contractCreator.ABI = (<any> contractCreatortMetadata).abi;
        this.contractCreator.instance = new this.web3.eth.Contract(this.contractCreator.ABI, this.contractCreator.address);
        
    }
   
    async getAccounts() {
        return await this.web3.eth.getAccounts();
    }


    createTradeableWallet(fSucess: any, fError: any) {
            
        let self = this; 
        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0]; 

            console.log("selected accont para create:" + selectedAccount);

            //TODO: questao de concorrencia do Last Created - fazer map com hash da transacao -> contrato 
            self.contractCreator.instance.methods.createTradeableContract().send({from: selectedAccount})
            .once('receipt', function(receipt){ 
                console.log("receipt");
                console.log(receipt); 
                console.log(receipt.events[0]);                                
                console.log(receipt.events[0].address); 
                fSucess(receipt.events[0].address);
             })
            .on('error', function(error){ 
                fError(error);
             })
            .catch (error => 
            {
                fError(error);
            });

        }); //close getAccounts
    }



   withdrawTokens(tradeableContractAddr: string, tokenAddr: string, valueToWithdraw: number, fSucess: any, fError: any) {

       console.log("withdrawTokens do " + tradeableContractAddr); 
       console.log("tokenAddr " + tokenAddr); 
       console.log("valueToWithdraw " + valueToWithdraw); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);
            
            tradeableContract.instance.methods.makeUntrustedWithdrawalOfTokens(tokenAddr, valueToWithdraw).send ({ from:selectedAccount, gas:300000 })
            .then (result => fSucess(result))
            .catch (error => fError(error));
        });     
    }

   withdrawEth(tradeableContractAddr: string, valueToWithdrawInGWei: number, fSucess: any, fError: any) {

       console.log("withdrawEth do " + tradeableContractAddr); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);
            
            let sPriceInGWei = String(valueToWithdrawInGWei);
            let valueToWithdrawInWei = this.web3.utils.toWei(sPriceInGWei, 'GWei');

       console.log("valor= " + valueToWithdrawInWei); 


            tradeableContract.instance.methods.makeUntrustWithdrawOfEther(valueToWithdrawInWei).send ({ from:selectedAccount, gas:300000 })
            .then (result => fSucess(result))
            .catch (error => fError(error));
        }); 
    }

   sendEth(tradeableContractAddr: string, toAddress:string, valueToWithdrawInGWei: number, 
        hexData: string, fSucess: any, fError: any) {

       console.log("withdrawEth do " + tradeableContractAddr); 
       console.log("hexData " + hexData); 
  /*
       if (hexData) {
*/
//TODO: REVER
       if (!hexData) {
           hexData = "0x0000";
       }
            let hexDataInBytes = Web3Utils.hexToBytes(hexData);
            console.log("hexDataInBytes "); 
            console.log(hexDataInBytes); 

            this.getAccounts().then(accounts => {
                    let selectedAccount = accounts[0];
                    let tradeableContract =  this.createTradeableContract(tradeableContractAddr);
                    
                    let sPriceInGWei = String(valueToWithdrawInGWei);
                    let valueToWithdrawInWei = this.web3.utils.toWei(sPriceInGWei, 'GWei');

                    tradeableContract.instance.methods.makeUntrustedEtherTransferToOutside(toAddress, valueToWithdrawInWei, hexData)
                    .send ({ from:selectedAccount, gas:500000 })
                    .then (result => fSucess(result))
                    .catch (error => fError(error));
                }); 
         /*   
       } 
       else {

            this.getAccounts().then(accounts => {
                    let selectedAccount = accounts[0];
                    let tradeableContract =  this.createTradeableContract(tradeableContractAddr);
                    
                    let sPriceInGWei = String(valueToWithdrawInGWei);
                    let valueToWithdrawInWei = this.web3.utils.toWei(sPriceInGWei, 'GWei');
                    console.log("toAddress=" + toAddress);
                    console.log("valueToWithdrawInWei=" + valueToWithdrawInWei);

                    tradeableContract.instance.methods.makeUntrustedEtherTransferToOutside(toAddress, valueToWithdrawInWei)
                    .send ({ from:selectedAccount, gas:500000 })
                    .then (result => fSucess(result))
                    .catch (error => fError(error));
                }); 
            
       }   
*/

    }


   setAvailableToSell(tradeableContractAddr: string, priceInGWei: number, hashDescription: string, fSucess: any, fError: any) {

       console.log("set available to sell with price (GWei) " + priceInGWei); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            let sPriceInGWei = String(priceInGWei);

            let priceInWei = this.web3.utils.toWei(sPriceInGWei, 'GWei');
            console.log(priceInWei);

            tradeableContract.instance.methods.setAvailableToSell(priceInWei, hashDescription).send ({ from:selectedAccount })
            .then (result => 
            {
                fSucess(result);
                console.log(result);

            })
            .catch (error => fError(error));
        });     
    }

   cancelSale(tradeableContractAddr: string, fSucess: any, fError: any) {

       console.log("cancel sale "); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            tradeableContract.instance.methods.cancelSellingAction().send ({ from:selectedAccount })
            .then (result => 
            {
                fSucess(result);
                console.log(result);

            })
            .catch (error => fError(error));
        });     
    }

    getPriceToBuyInGWei(tradeableContractAddr: string, fSucess: any, fError: any) {
    
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            tradeableContract.instance.methods.getPriceToSellInWei().call()
            .then(result => 
                {
                    if (!isNaN(result)) {
                        let priceInGwei = this.web3.utils.fromWei(result, "GWei");
                        fSucess(priceInGwei);
                    }
                    else {
                        fError("NAN")
                    }
                })
            .catch (error => fError(error));
    } 


    getEthBalance(tradeableContractAddr: string, fSucess: any, fError: any) {
    
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            tradeableContract.instance.methods.getEtherBalance().call()
            .then(result => 
                {
                    if (!isNaN(result)) {
                        let balanceInGwei = this.web3.utils.fromWei(result, "GWei");
                        fSucess(balanceInGwei);
                    }
                    else {
                        fError("NAN")
                    }
                })
            .catch (error => fError(error));
    } 

    getTokenBalanceOf(tradeableContractAddr: string, tokenAddr: string, fSucess: any, fError: any) {
    
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            tradeableContract.instance.methods.getTokenBalanceOf(tokenAddr).call()
            .then(result => 
                {
                    if (!isNaN(result)) {
                        fSucess(result);
                    }
                    else {
                        fError("NAN")
                    }
                })
            .catch (error => fError(error));
    } 


    getHashDescription(tradeableContractAddr: string, fSucess: any, fError: any) {
    
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            tradeableContract.instance.methods.getHashDescription().call()
            .then(result => 
                {
                    fSucess(result);
                })
            .catch (error => fError(error));
    } 

    getInfoIfIsAvailableToSell(tradeableContractAddr: string, fSucess: any, fError: any) {
    
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            tradeableContract.instance.methods.getPriceToSellInWei().call()
            .then(result => 
                {
                    if (result==-1)  fSucess(false);
                    else fSucess(true);
                })
            .catch (error => fError(error));
    }

    getTotalBlocksToFinishFrontRunningRiskExternal(tradeableContractAddr: string, fSucess: any, fError: any) {
    
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            tradeableContract.instance.methods.getTotalBlocksToFinishFrontRunningRiskExternal().call()
            .then(result => 
                {
                    fSucess(result);
                })
            .catch (error => fError(error));
    }


    getPercentualFee(tradeableContractAddr: string, fSucess: any, fError: any) {
    
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            tradeableContract.instance.methods.getDenominatorFee().call()
            .then(result => 
                {
                    console.log("result denominator=" +result);

                    let feePercent = 100.0/result;
                    console.log("feePercent=" + feePercent);
                    fSucess(feePercent);
                })
            .catch (error => fError(error));
    } 


   buyWallet(tradeableContractAddr: string, priceInGWei: number, fSucess: any, fError: any) {

       console.log("Buy with price (GWei) " + priceInGWei); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];

            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            console.log("vai chamar buy - changeOwner");

            let sPriceInGWei = String(priceInGWei);

            let priceInWei = this.web3.utils.toWei(sPriceInGWei, 'GWei');
            console.log(priceInWei);

            //PAYABLE FUNCTION
            tradeableContract.instance.methods.untrustedChangeOwnershipWithTrade().send ({ from:selectedAccount, value:priceInWei, gas:300000 })
            .then (result => 
            {
                fSucess(result);
                console.log("result");
                console.log(result);

            })
            .catch (error => fError(error));
        });     

    }

    private createTradeableContract(tradeableContractAddr: string) {

        let tradeableContract = new Contract();
        tradeableContract.address =  tradeableContractAddr;
        tradeableContract.ABI = (<any>interfaceTradeableContractMetadata).abi;
        tradeableContract.instance = new this.web3.eth.Contract(tradeableContract.ABI, tradeableContract.address);
        console.log(tradeableContract);                
        return tradeableContract;
    }


    getBlockTimestamp(blockHash: number, fResult: any) {
        this.web3.eth.getBlock(blockHash, fResult);
    }


    getContractHistory(tradeableContractAddr: string, fEventOwner: any) {

        let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

        console.log("getPastEvents (owners)... ");
  
        tradeableContract.instance.getPastEvents('NewOwnerEvent', {
                fromBlock: 0,
                toBlock: 'latest'
        })
        .then(events =>  fEventOwner(events));
    }

    getTokenTransferHistory(tradeableContractAddr: string, fEvents: any) {

        let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

        console.log("getTokenTransferHistory ... ");
  
        tradeableContract.instance.getPastEvents('TransferTokensEvent', {
                filter: {isWithdraw: [true]},
                fromBlock: 0,
                toBlock: 'latest'
        })
        .then(events =>  fEvents(events));
    }
    
    async getNetwork() {

        return await this.web3.eth.net.getNetworkType();    
    }



} 

