import { Component } from '@angular/core';

import { BlockchainService } from './service/blockchain-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Tradeable-Wallet';
  network: string;

    constructor(private blockchainService: BlockchainService) {

        this.blockchainService.getNetwork().then(
          data => this.network = data
          );
     }

}
