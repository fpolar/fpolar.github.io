import { Component, OnInit } from '@angular/core';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  ticker: string;
  name: string;
  price: string;
  change: string;
  date: string;
  exchange: string;
  market: string;
  constructor() { }

  ngOnInit(): void {
  }

}
