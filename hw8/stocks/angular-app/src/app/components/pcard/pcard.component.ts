import { Component, OnInit, Input } from '@angular/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from '../../app-routing.module';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pcard',
  templateUrl: './pcard.component.html',
  styleUrls: ['./pcard.component.css']
})
export class PcardComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  quantity: number;
  totalCost: number;
  avgCost: number;
  marketVal: number;

  purchaseQuantity = 0;
  
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
    this.quantity = this.rawCardData['quantity'];
    this.totalCost = this.rawCardData['totalCost'];
    this.avgCost = this.rawCardData['avgCost'];
    this.change = this.rawCardData['change'];
    this.marketVal = this.rawCardData['marketVal'];
  	this.noChange = this.rawCardData['noChange'];
  	this.changePositive = this.rawCardData['changePositive'];
  	this.faCaret = this.rawCardData['faCaret'];
  	this.cardColor = this.rawCardData['cardColor'];
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
    console.log(this.quantity, this.purchaseQuantity);
    this.quantity += this.purchaseQuantity;
    this.marketVal = this.quantity*this.price;
    this.totalCost = this.totalCost+this.price*this.purchaseQuantity;
    localStorage.setItem(this.ticker, String(this.quantity));
    localStorage.setItem(this.ticker+"-total-cost", String(this.totalCost));
    modal.close('Save click');
  }

  sellStock(modal) {
    this.quantity += -this.purchaseQuantity;
    this.marketVal = this.quantity*this.price;

    if(this.quantity <= 0){
      this.removed = true;
      var p = localStorage.getItem('p');
      p = p.replace(this.ticker+",", '');
      localStorage.setItem('p', p);
      localStorage.removeItem(this.ticker+'-total-cost');
      localStorage.removeItem(this.ticker);
      window.location.reload();
    }else{
      this.totalCost = -this.purchaseQuantity*this.price+this.totalCost;
      localStorage.setItem(this.ticker, String(this.quantity));
      localStorage.setItem(this.ticker+"-total-cost", String(this.totalCost));
    }
    modal.close('Save click');
  }
}
