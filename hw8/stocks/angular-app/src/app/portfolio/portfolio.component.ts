import { Component, OnInit } from '@angular/core';

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
  
  constructor() { }

  ngOnInit(): void {
  }

}
