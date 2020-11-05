import { Component, OnInit, Input } from '@angular/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from '../../app-routing.module';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-wcard',
  templateUrl: './wcard.component.html',
  styleUrls: ['./wcard.component.css']
})
export class WcardComponent implements OnInit {

  constructor() { }

  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  noChange: boolean;
  changePositive: boolean;
  faCaret = faCaretUp;
  cardColor: string;
  removed = false;
  closeResult = ''; 

  @Input() rawCardData: any;
  ngOnInit(): void {
  	this.ticker = this.rawCardData['ticker'];
  	this.name = this.rawCardData['name'];
  	this.price = this.rawCardData['price'];
  	this.change = this.rawCardData['change'];
  	this.changePercent = this.rawCardData['changePercent'];
  	this.noChange = this.rawCardData['noChange'];
  	this.changePositive = this.rawCardData['changePositive'];
  	this.faCaret = this.rawCardData['faCaret'];
  	this.cardColor = this.rawCardData['cardColor'];
  }

  removeFromWatchList(): void{
  	let wl = localStorage.getItem('wl');
    wl = wl.replace(this.ticker+",", '');
    localStorage.setItem('wl', wl);
    this.removed = true;
  }

}
