import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule  } from 'angular-font-awesome';
import { HttpClientModule } from '@angular/common/http';


import {AppLoadModule} from './app-load/app-load.module';
import { AppComponent } from './app.component';
import { NewWalletComponent } from './new-wallet/new-wallet.component';
import { AppRoutingModule } from './app-routing.module';
import { BlockchainService } from './service/blockchain-service';
import { DescriptionService } from './service/description.service';

import { InitialPanelComponent } from './initial-panel/initial-panel.component';
import { BuyWalletComponent } from './buy-wallet/buy-wallet.component';
import { WithdrawTokensComponent } from './withdraw-tokens/withdraw-tokens.component';
import { PutWalletSaleComponent } from './put-wallet-sale/put-wallet-sale.component';
import { AllOwnersTwComponent } from './all-owners-tw/all-owners-tw.component';
import { AllWithdrawComponent } from './all-withdraw/all-withdraw.component';
import { SendEthComponent } from './send-eth/send-eth.component';
import { WithdrawEthComponent } from './withdraw-eth/withdraw-eth.component';
import { CancelSellingComponent } from './cancel-selling/cancel-selling.component';



@NgModule({
  declarations: [
    AppComponent,
    NewWalletComponent,
    InitialPanelComponent,
    BuyWalletComponent,
    WithdrawTokensComponent,
    PutWalletSaleComponent,
    AllOwnersTwComponent,
    AllWithdrawComponent,
    SendEthComponent,
    WithdrawEthComponent,
    CancelSellingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularFontAwesomeModule,
    AppLoadModule 
  ],
  providers: [BlockchainService, DescriptionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
