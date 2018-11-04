import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-owners-tw',
  templateUrl: './all-owners-tw.component.html',
  styleUrls: ['./all-owners-tw.component.css']
})
export class AllOwnersTwComponent implements OnInit {

  address: string;
  order: string = '';
  reverse: boolean = false;
  events: any;

  constructor(private blockchainService: BlockchainService, private route: ActivatedRoute, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    
    this.address = this.route.snapshot.paramMap.get('address');
    let self = this;

    this.blockchainService.getContractHistory(this.address, function(result) {

      self.events = result;
      console.log("*** event");  
      console.log(result);  

          for (let event of self.events) {

               self.blockchainService.getBlockTimestamp(event.blockHash,
                    function(error, result) {
                        if(!error) {
                            event.dateTime = new Date(result.timestamp*1000);
                            console.log(event.dateTime);
                            self.ref.detectChanges();

                        }
                        else {
                            console.log("Date/Time Error" );
                            console.error(error);
                        }
                });
          }


    });

  }


  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
    this.ref.detectChanges();
  }


  customComparator(itemA, itemB) {
    return itemB - itemA;
  }



}
