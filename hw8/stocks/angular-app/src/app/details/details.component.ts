import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../components/nav/nav.component';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faCaretSquareDown as farCaretDown } from '@fortawesome/free-regular-svg-icons';
import { faCaretSquareDown as fasCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretSquareUp as farCaretUp } from '@fortawesome/free-regular-svg-icons';
import { faCaretSquareUp as fasCaretUp } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  farStar = farStar;
  fasStar = fasStar;
  farCaretDown = farCaretDown;
  fasCaretDown = fasCaretDown;
  farCaretUp = farCaretUp;
  fasCaretUp = fasCaretUp;
  ticker: string;
  name: string;
  price: string;
  change: string;
  date: string;
  exchange: string;
  market: string;
  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.ticker = this.route.snapshot.paramMap.get('tick').toUpperCase();
    this.http.get("http://localhost:3000/api/details/" + this.ticker, {responseType: 'json'}).subscribe(response=>{    
      console.log(response);
    })
  }

}
