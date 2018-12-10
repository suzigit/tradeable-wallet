import { Component } from '@angular/core';

import { BlockchainService } from './service/blockchain-service';
import {NotificationService} from './notification-service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Tradeable-Wallet';
  network: string;
  notification: string;
  showNotification: boolean;  

    constructor(private blockchainService: BlockchainService,
      private notificationService: NotificationService) {

        this.blockchainService.getNetwork().then(
          data => this.network = data
          );
     }


  ngOnInit() {
    this.notificationService
            .notification$
            .subscribe(message => { 
              this.notification = message;
              this.showNotification = true;
            });
  }

}
