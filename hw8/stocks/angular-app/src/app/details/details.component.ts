import { Component, OnInit, Input } from '@angular/core';
import { NavComponent } from '../components/nav/nav.component';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown as fasCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretUp as fasCaretUp } from '@fortawesome/free-solid-svg-icons';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// import { HighchartsChartModule, HighchartsChartComponent} from 'highcharts-angular';
import * as Highcharts from 'highcharts';

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

  //highcharts fields
  Highcharts: typeof Highcharts = Highcharts; // required
  // chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {}; // required
  // chartCallback: Highcharts.ChartCallbackFunction = function (chart) { ... } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  constructor(private http: HttpClient, private route: ActivatedRoute, private modalService: NgbModal) { }

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

      var chartDate = endDate;
      if(this.marketStatus){
        chartDate = startDate;
      }
      console.log(this.marketStatus);
      console.log(startDate);
      console.log(endDate);
      console.log(response['timestamp']);
      var d = chartDate.getDate() - 1; //we want the info leading up to this day
      var ds = ''+d;
      if(d<10) ds='0'+d;
      var m = chartDate.getMonth() + 1; //Months are zero based
      var ms = ''+m;
      if(m<10) ms='0'+m;
      var y = chartDate.getFullYear();
      var chartDateStr = y+"-"+ms+"-"+ds;

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
        console.log(data1);
        console.log(data2);

        //highchart init
        this.chartOptions = {
            title: {
                text: this.ticker
            },

            subtitle: {
                text: 'Source: <a href="https://api.tiingo.com/">Tiingo</a>'
            },

            xAxis: {
            type: 'datetime'
            },
            yAxis: [{ 
            labels: {
                format: '{value}',
                style: {
                    color: '#000000'
                }
            },
            title: {
                text: 'Stock Price',
                style: {
                    color: '#000000'
                }
            }
        },
            {
              labels: {
                  formatter: function() {
                  return this.value / 1000 + 'k';
                },
                style: {
                      color: '#000000'
                  }
              },
              title: {
                  text: 'Volume',
                  style: {
                      color: '#000000'
                  }
              },
            opposite: true
          }],

            rangeSelector: {
                allButtonsEnabled: true,
                buttons: [ {
                    type: 'day',
                    count: 7,
                    text: '7d'
                }, {
                    type: 'day',
                    count: 15,
                    text: '15d'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }],
                selected: 4
            },

            series: [{
                name: 'AAPL',
                type: 'area',
                data: data1,
                yAxis: 0,
                gapSize: 5,
                tooltip: {
                    valueDecimals: 2
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, '255,255,255']
                    ]
                },
                threshold: null
            },
            {
                name: 'BAPL',
                type: 'area',
                yAxis: 1,
                data: data2,
                gapSize: 5,
                tooltip: {
                    valueDecimals: 2
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, '255,255,255']
                    ]
                },
                threshold: null
            }]
            }
        this.updateFlag = true;
        });
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

}
