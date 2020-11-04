import { Component, OnInit, Input } from '@angular/core';
import { NavComponent } from '../components/nav/nav.component';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown as fasCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretUp as fasCaretUp } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import * as Highcharts from "highcharts/highstock";
import {Options} from "highcharts/highstock";
import IndicatorsCore from "highcharts/indicators/indicators";
import IndicatorZigzag from "highcharts/indicators/zigzag";

IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
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

  constructor(private http: HttpClient, private route: ActivatedRoute, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.ticker = this.route.snapshot.paramMap.get('tick').toUpperCase();
    //init star with localStorage
    this.initStar();

    //http request to init stock info
    this.http.get("http://localhost:3000/api/details/" + this.ticker, {responseType: 'json'}).subscribe(response=>{    

      this.name  = response['name'];
      this.price  = response['last'];
      this.change = response['last'] - response['prevClose'];
      this.changePercent = this.change/response['prevClose'];

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
              ]]
      //I know it's a little past 9, u can head out if you want
      //no, im sure i can help solve your problem
      //ok im having trouble with the highcharts stock graphs and the angular cards
      //we never said that part would be easy, google it and understand the examples out there, i'm not going to explain it to you
      //https://getbootstrap.com/docs/4.0/components/card/
      //https://www.highcharts.com/demo/stock/sma-volume-by-price
      this.http.get("http://localhost:3000/api/chart-data/" + chartDateStr +"/"+ this.ticker, {responseType: 'json'}).subscribe(response2=>{
        var data1 = [];
        var data2 = [];
        response2['charts'].forEach(element => {
          var x1 = Date.parse(element['date']);
          var x2 = Date.parse(element['date']);
          var y1 = element['close'];
          var y2 = element['volume'];
          data1.push([x1, y1]);
          data2.push([x2, y2]);
        });

        //highchart init
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

          xAxis: {
            type: 'datetime'
          },

          rangeSelector: {
            enabled: false
          },

          tooltip: {
              split: true
          },

        //   series: [
        //     {
        //       type: "line",
        //       /* throws an error in console, but works correctly */
        //       //fillColor: this.chartColor,
        //       color: this.chartColor,
        //       name: `${this.ticker}`,
        //       id: "base",
        //       data: data1
        //     },
        //     {
        //       type: "bar",
        //       /* throws an error in console, but works correctly */
        //       //fillColor: this.chartColor,
        //       color: this.chartColor,
        //       name: `${this.ticker}`,
        //       id: "sidebar",
        //       data: data2
        //     },
        //   ]
          series: [{
              type: 'candlestick',
              name: 'AAPL',
              id: 'aapl',
              zIndex: 2,
              data: data1
          }, {
              type: 'column',
              name: 'Volume',
              id: 'volume',
              data: data2,
              yAxis: 1
          }, {
              type: 'vbp',
              linkedTo: 'aapl',
              params: {
                  volumeSeriesID: 'volume'
              },
              dataLabels: {
                  enabled: false
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
        this.updateFlag2 = true;
        });
       })
      this.http.get("http://localhost:3000/api/news-data/" + this.ticker, {responseType: 'json'}).subscribe(response=>{ 
        
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

  }

  //toggles star icon and saves or deletes tick from localStorage
  initStar(): void {
    var wl = this.myStorage.getItem('wl');
    if(wl && wl.includes(this.ticker+",")){
      this.faStar = fasStar;
    }
  }

  toggleStar(): void {
    var wl = this.myStorage.getItem('wl');
    if(wl && wl.includes(this.ticker+",")){
      wl = wl.replace(this.ticker+",", '');
      this.myStorage.setItem('wl', wl);
      this.faStar = farStar;
    }else{
      if(!wl) wl = '';
      this.myStorage.setItem('wl', wl+this.ticker+",");
      this.faStar = fasStar;
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
    var t = this.myStorage.getItem(this.ticker);
    if(t){
      var x = this.purchaseQuantity+Number(t);
      localStorage.setItem(this.ticker, String(x));
    }else{
      localStorage.setItem(this.ticker, String(this.purchaseQuantity));
    }
    modal.close('Save click');
  }


}
