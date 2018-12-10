// errors-handler.ts
import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { NotificationService } from './notification-service';
import {BlockchainConnectionError} from './service/blockchain-connection-error';


@Injectable()
export class ErrorsHandler implements ErrorHandler {


constructor(
       // Because the ErrorHandler is created before the providers, we’ll have to use the Injector to get them.
       private injector: Injector,
   ) { }

  handleError(error: Error) {

      const notificationService = this.injector.get(NotificationService);

     // Do whatever you like with the error (send it to the server?)
     // And log it to the console

     console.error('It happens: ', error);
     console.log(error);
/*
    if(error instanceof BlockchainConnectionError){
         console.error('Inside instance of ');
*/

//        let a = <BlockchainConnectionError> error;        
//        console.error(a.sayHello());
        return notificationService.notify(error);
 /*   }

*/
  }
}