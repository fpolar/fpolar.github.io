import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../components/nav/nav.component';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown as fasCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretUp as fasCaretUp } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  myStorage = window.localStorage;
  faStar = farStar; 
  faCaret = fasCaretDown;
  ticker: string;
  name: string;
  price: string;
  change: number;
  changePercent: number;
  changePositive: boolean;
  date: string;
  exchange: string;
  marketStatus: boolean;
  market: string;
  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.ticker = this.route.snapshot.paramMap.get('tick').toUpperCase();
    //init star with localStorage
    if(this.myStorage.getItem(this.ticker)){
      this.faStar = fasStar;
    }
    //http request to init stock info
    this.http.get("http://localhost:3000/api/details/" + this.ticker, {responseType: 'json'}).subscribe(response=>{    
      console.log(response);
      this.name  = response['name'];
      this.price  = response['last'];
      this.change = response['last'] - response['prevClose'];
      this.changePercent = this.change/response['prevClose'];
      console.log( this.change);
      console.log( this.changePercent);
      if( this.change < 0){
        this.changePositive = false;
        this.faCaret = fasCaretDown;
      }else{
        this.changePositive = true;
        this.faCaret = fasCaretUp;
      }
      this.exchange = response['exchangeCode'];
      var startDate = new Date();
      var endDate   = new Date(response['timestamp']);
      var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
      this.marketStatus = Math.abs(seconds) < 60;
      if(this.marketStatus){
        this.market = "Market is Open";
      }else{
        this.market = "Market Closed on "+endDate;
      }
      // Market Status must be open if the difference between current Timestamp
// (current Timestamp will be of the created using new Date() in javascript) and ‘timestamp’ key is
// less than 60 seconds.
    })

  }

  //toggles star icon and saves or deletes tick from localStorage
  toggleStar(): void {
    if(this.myStorage.getItem(this.ticker)){
      localStorage.removeItem(this.ticker);
      this.faStar = farStar;
    }else{
      localStorage.setItem(this.ticker, 'X');
      this.faStar = fasStar;
    }
  }

}
