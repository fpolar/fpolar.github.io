import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { faCaretDown} from '@fortawesome/free-solid-svg-icons';
import { faCaretUp} from '@fortawesome/free-solid-svg-icons';

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
  cardsEmpty=false;
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    var lcwl = localStorage.getItem('wl');
    if(!lcwl){
      console.log('no items in watchlist');
      this.cardsEmpty = true;   
      this.spin = false;   
    }else{
      const tickers = lcwl.split(',');
      tickers.pop();
      let card_reqs_completed = 0;
      if(tickers.length == 0){
        console.log('no items in watchlist');
        this.cardsEmpty = true;   
        this.spin = false;   
      }else{
        tickers.forEach(t => {
          console.log(t);
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
              curr_card['faCaret'] = faCaretUp;
              curr_card['cardColor'] = 'black'
              if( curr_card['change'] < 0){
                curr_card['changePositive'] = false;
                curr_card['faCaret'] = faCaretDown;
                curr_card['cardColor'] = '#d9534f' // danger red
              }
              if( curr_card['change'] == 0){
                curr_card['noChange'] = true;
                curr_card['cardColor'] = 'black'
              }

              this.cards.push(curr_card);
              this.cardsEmpty = false;
            }
            console.log(tickers.length);
            console.log(card_reqs_completed);
            card_reqs_completed++;
            if(card_reqs_completed == tickers.length){
              this.spin = false;
            }
          });
        });
      }
    }
  }

}
