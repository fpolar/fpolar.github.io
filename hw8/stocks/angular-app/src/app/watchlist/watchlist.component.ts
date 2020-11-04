import { Component, OnInit } from '@angular/core';
import { AlertModule, AlertService } from '../components/_alert';
import { HttpClient } from '@angular/common/http';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { faCaretDown as fasCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretUp as fasCaretUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  spin=true;
  alertOptions = {
    autoClose: false,
    keepAfterRouteChange: false
  };
  cards = [];
  
  constructor(private http: HttpClient, 
    private modalService: NgbModal, public alertService: AlertService) { }

  ngOnInit(): void {
    const tickers = localStorage.getItem('wl').split(',');
    let card_reqs_completed = 0;
    tickers.forEach(t => {
      if(t!=''){
        this.http.get("http://localhost:3000/api/details/" + t, {responseType: 'json'}).subscribe(response=>{    
          if(!(response['detail'])){
            let curr_card = {}
            curr_card['ticker'] = t;
            curr_card['name']  = response['name'];
            curr_card['price']  = response['last'];
            curr_card['change'] = response['last'] - response['prevClose'];
            curr_card['changePercent'] = curr_card['change']/response['prevClose'];

            curr_card['noChange'] = false;
            curr_card['changePositive'] = true;
            curr_card['faCaret'] = fasCaretUp;
            curr_card['cardColor'] = 'black'
            if( curr_card['change'] < 0){
              curr_card['changePositive'] = false;
              curr_card['faCaret'] = fasCaretDown;
              curr_card['cardColor'] = '#d9534f' // danger red
            }
            if( curr_card['change'] == 0){
              curr_card['noChange'] = true;
              curr_card['cardColor'] = 'black'
            }


          }
          if(card_reqs_completed == tickers.length){
            this.spin = false;
          }
        });
      }
    });

    if(this.cards.length == 0){
      this.alertService.warn('Currently you don\'t have any stocks in your watchlist.', this.alertOptions);
    }
  }

}
