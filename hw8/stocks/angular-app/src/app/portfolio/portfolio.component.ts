import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { faCaretDown} from '@fortawesome/free-solid-svg-icons';
import { faCaretUp} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  spin=true;
  alertOptions = {
    autoClose: false,
    keepAfterRouteChange: false
  };
  cards = [];
  cardsEmpty=false;
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const tickers = localStorage.getItem('p').split(',');
    tickers.pop();
    let card_reqs_completed = 0;
    if(tickers.length == 0){
      console.log('no items in portfolio');
      this.cardsEmpty = true;   
      this.spin = false;   
    }else{
      tickers.forEach(t => {
        console.log(t);
        this.http.get("http://localhost:3000/api/details/" + t, {responseType: 'json'}).subscribe(response=>{    
          if(!(response['detail'])){
            let q = parseInt(localStorage.getItem(t));
            let c = parseInt(localStorage.getItem(t+'-total-cost'));
            let curr_card = {}
            curr_card['ticker'] = t;
            curr_card['name']  = response['name'];
            curr_card['price']  = response['last'];
            curr_card['quantity'] = q;
            curr_card['totalCost'] = c*q;
            curr_card['avgCost'] = c/q;
            curr_card['change'] = curr_card['avgCost'] - curr_card['price'];
            curr_card['marketVal'] = q*curr_card['price'];

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
