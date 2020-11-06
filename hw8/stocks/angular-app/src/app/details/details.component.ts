import { Component, OnInit, Input } from '@angular/core';
import { NavComponent } from '../components/nav/nav.component';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown as fasCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretUp as fasCaretUp } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertModule, AlertService } from '../components/_alert';
import { interval } from 'rxjs';

import * as Highcharts from "highcharts/highstock";
// import more from 'highcharts/highcharts-more';
// more(Highcharts);
import {Options} from "highcharts/highstock";
import IndicatorsCore from "highcharts/indicators/indicators";
import IndicatorZigzag from "highcharts/indicators/zigzag";
import IndicatorVbp from "highcharts/indicators/volume-by-price";

IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);
//this line causes chart to appear at the bottom
IndicatorVbp(Highcharts);

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  spin=true;
  alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  validResponse = false;
  starColor = 'black';

  // gcpURL = "http://localhost:3000";
  gcpURL = 'https://angular-stocks.wn.r.appspot.com'
  
  //header fields
  myStorage = window.localStorage;
  faStar = farStar; 
  faCaret = fasCaretDown;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  changePositive: boolean;
  noChange: boolean;
  date: string;
  exchange: string;
  marketStatus: boolean;
  market: string;
  purchaseQuantity = 0;
  closeResult = ''; 

  //summary tab fields
  desc: string;
  startDate: string;
  hiPrice: number;
  loPrice: number;
  openPrice: number;
  midPrice: number;
  askPrice: number;
  askSize: number;
  bidPrice: number;
  bidSize: number;
  prevClose: number;
  volume: number;

  //news fields
  cards = [];
 
  //highcharts fields
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  updateFlag: boolean = false; // optional boolean
  chartColor: string;

  Highcharts2: typeof Highcharts = Highcharts;
  chartOptions2: Highcharts.Options = {};
  updateFlag2: boolean = false; // optional boolean

  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  api_request_interval: any;

  constructor(private http: HttpClient, private route: ActivatedRoute, 
    private modalService: NgbModal, public alertService: AlertService) { }

  ngOnInit(): void {
    this.ticker = this.route.snapshot.paramMap.get('tick').toUpperCase();
    //init star with localStorage
    this.initStar();

    //http request to init stock info
    this.apiRequests(); 
    // this.api_request_interval = interval(15000).subscribe(x => { this.apiRequests(); });
  }

  ngOnDestroy(): void {
    //this.api_request_interval.unsubscribe();
  }

  // ngOnChanges(): void {
  //   this.apiRequests(); 
  // }

  apiRequests():void {
    this.http.get(this.gcpURL+"/api/details/" + this.ticker, {responseType: 'json'}).subscribe(response=>{    
      console.log('apiRequests function call:', response);
      if(response['detail']){
        this.alertService.error('No results found. Please enter valid Ticker.', this.alertOptions);
        this.validResponse = false;
        this.spin = false;
      }else{
        this.validResponse = true;
        this.spin = false;
      }
      this.name  = response['name'];
      this.price  = response['last'];
      this.change = response['last'] - response['prevClose'];
      this.changePercent = this.change/response['prevClose'];

      this.noChange = false;
      if(this.change == 0){
        this.noChange = true;
        this.chartColor = 'black' // black
      }
      if( this.change < 0){
        this.changePositive = false;
        this.faCaret = fasCaretDown;
        this.chartColor = '#d9534f' // danger red
      }else{
        this.changePositive = true;
        this.faCaret = fasCaretUp;
        this.chartColor = '#5cb85c' // success green
      }
      this.exchange = response['exchangeCode'];
      var startDate = new Date();
      var endDate   = new Date(response['timestamp']);
      var seconds = Math.abs(endDate.getTime() - startDate.getTime()) / 1000;
      this.marketStatus = Math.abs(seconds) < 60;
      if(this.marketStatus){
        this.market = "Market is Open";
      }else{
        this.market = "Market Closed on "+endDate;
      }

      //summary tab init
      this.desc = response['description'];
      this.startDate = response['startDate'];
      this.hiPrice = response['high'];
      this.loPrice = response['low'];
      this.openPrice = response['open'];
      this.midPrice = response['mid'];
      this.askPrice = response['askPrice'];
      this.askSize = response['askSize'];
      this.bidPrice = response['bidPrice'];
      this.bidSize = response['bidSize'];
      this.prevClose = response['prevClose'];
      this.volume = response['volume'];

      //deciding on and formatting date for chart data
      var chartDate = endDate;
      if(this.marketStatus){
        chartDate = startDate;
      }
      this.date = chartDate.toLocaleString('sv-SE');

      var d = chartDate.getDate(); //we want the info leading up to this day
      if(!this.marketStatus){
        d = d-1;
      }
      var ds = ''+d;
      if(d<10) ds='0'+d;
      var m = chartDate.getMonth() + 1; //Months are zero based
      var ms = ''+m;
      if(m<10) ms='0'+m;
      var y = chartDate.getFullYear();
      var chartDateStr = y+"-"+ms+"-"+ds;
      var groupingUnits = [[
                  'week',                         // unit name
                  [1]                             // allowed multiples
              ], [
                  'month',
                  [1, 2, 3, 4, 6]
              ]];

      this.http.get(this.gcpURL+"/api/chart-data/" + chartDateStr +"/"+ this.ticker, {responseType: 'json'}).subscribe(response2=>{
        var data1 = [];
        var data2 = [];
        var data3 = [];
        response2['charts'].forEach(element => {
          var x1 = Date.parse(element['date']);
          var y1 = element['close'];
          var volume3 = element['volume'];
          
          var open2 = element['open'];
          var hi2 = element['high'];
          var lo2 = element['low'];
          var close2 = element['close'];

          data1.push([x1, y1]);
          data2.push([x1, open2, hi2, lo2, close2]);
          data3.push([x1, volume3]);
        });
        console.log(data1,data2,data3);

        //highchart1 init
        this.chartOptions = { 
          chart: {
            type: 'area'
          },
          title: {
            text: `${this.ticker}`,
            style: {
              color: 'grey'
            }
          },
          time: {
            timezoneOffset: 420
          }, 
          xAxis: {
            type: 'datetime'
          },
          navigator: {
            // maskFill: this.chartColor

          },
          rangeSelector: {
            enabled: false
          },

          series: [
            {
              type: "line",
              /* throws an error in console, but works correctly */
              //fillColor: this.chartColor,
              color: this.chartColor,
              name: `${this.ticker}`,
              id: "base",
              data: data1
            },
          ]
        };

        this.chartOptions2 = {
          rangeSelector: {
              selected: 2
          },

          title: {
              text: this.ticker+' Historical'
          },

          subtitle: {
              text: 'With SMA and Volume by Price technical indicators'
          },

          xAxis: {
            type: 'datetime'
          },
          time: {
            timezoneOffset: 420
          }, 
          yAxis: [{
              startOnTick: false,
              endOnTick: false,
              labels: {
                  align: 'right',
                  x: -3
              },
              title: {
                  text: 'OHLC'
              },
              height: '60%',
              lineWidth: 2,
              resize: {
                  enabled: true
              }
          }, {
              labels: {
                  align: 'right',
                  x: -3
              },
              title: {
                  text: 'Volume'
              },
              top: '65%',
              height: '35%',
              offset: 0,
              lineWidth: 2
          }],

          tooltip: {
              split: true
          },
          plotOptions: {
              series: {
                  dataGrouping: {
                      // approximation: 'ohlc',
                      units:  [[
                            'week',
                            [1]
                        ], [
                            'month',
                            [1, 3, 6, 12]
                        ], [
                            'year',
                            [1]
                        ]],
                      // forced: true,
                      // enabled: true,
                      // groupAll: true
                  }

              }
            },

          series: [{
              type: 'candlestick',
              name: this.ticker,
              id: 'aapl',
              zIndex: 2,
              dataGrouping: {
                approximation: 'ohlc',
              },
              data: data2
          }, {
              type: 'column',
              name: 'Volume',
              id: 'volume',
              data: data3,
              yAxis: 1
          }, {
              type: 'vbp',
              linkedTo: 'aapl',
              params: {
                  volumeSeriesID: 'volume'
              },
              zoneLines: {
                  enabled: false
              }
          }, {
              type: 'sma',
              linkedTo: 'aapl',
              zIndex: 1,
              marker: {
                  enabled: false
              }
          }]
        };

        this.updateFlag = true;
        });
        this.http.get(this.gcpURL+"/api/news-data/" + this.ticker, {responseType: 'json'}).subscribe(response=>{ 
          this.cards = [];
          response['articles'].forEach(element => {
            var curr_card = {};
            curr_card['source'] = element['source']['name'];
            curr_card['publishedDate'] = element['publishedAt'];
            curr_card['title'] = element['title'];
            curr_card['description'] = element['description'];
            curr_card['urlToImage'] = element['urlToImage'];
            curr_card['url'] = element['url'];
            this.cards.push(curr_card);
          });

        }); 
      });
      
    }

  chartTabClick(b): void{
    console.log('chart? ',b);
    this.updateFlag2 = true;
  }

  //toggles star icon and saves or deletes tick from localStorage
  initStar(): void {
    var wl = localStorage.getItem('wl');
    if(wl && wl.includes(this.ticker+",")){
      this.faStar = fasStar;
      this.starColor = 'gold';
    }
  }

  toggleStar(): void {
    var wl = localStorage.getItem('wl');
    if(wl && wl.includes(this.ticker+",")){
      wl = wl.replace(this.ticker+",", '');
      localStorage.setItem('wl', wl);
      this.faStar = farStar;
      this.alertService.error(this.ticker+' removed from watchlist.', this.alertOptions);
      this.starColor = 'black';
    }else{
      if(!wl) wl = '';
      localStorage.setItem('wl', wl+this.ticker+",");
      this.faStar = fasStar;
      this.alertService.success(this.ticker+' added to watchlist.', this.alertOptions);
      this.starColor = 'gold';
    }
  }

  open(content) { 
    this.modalService.open(content, 
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => { 
      this.closeResult = `Closed with: ${result}`; 
    }, (reason) => { 
      this.closeResult =  
         `Dismissed ${this.getDismissReason(reason)}`; 
    }); 
  } 
  
  private getDismissReason(reason: any): string { 
    if (reason === ModalDismissReasons.ESC) { 
      return 'by pressing ESC'; 
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) { 
      return 'by clicking on a backdrop'; 
    } else { 
      return `with: ${reason}`; 
    } 
  } 

  buyStock(modal) {
    //adding to portfolio local storage var
    var p = localStorage.getItem('p');
    if(!p){
      localStorage.setItem('p', this.ticker+",");
    }
    else if(!p.includes(this.ticker+",")){
      localStorage.setItem('p', p+this.ticker+",");
    }

    //adding to stock amount
    var t = localStorage.getItem(this.ticker);
    if(t){
      var x = this.purchaseQuantity+Number(t);
      localStorage.setItem(this.ticker, String(x));
    }else{
      localStorage.setItem(this.ticker, String(this.purchaseQuantity));
    }

    //record total cost
    var tc = localStorage.getItem(this.ticker+"-total-cost");
    console.log(this.purchaseQuantity,this.price,(tc));
    var x = this.purchaseQuantity*this.price;
    if(tc){
      x += Number(tc);
      console.log(x);
      localStorage.setItem(this.ticker+"-total-cost", String(x));
    }else{
      console.log(x);
      localStorage.setItem(this.ticker+"-total-cost", String(x));
    }
    modal.close('Save click');
  }


}
