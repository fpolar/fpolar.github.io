import { Component, OnInit, Input } from '@angular/core';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  source: string;
  title: string;
  desc: string;
  img_url: string;
  url: string;
  date: string;

  closeResult = ''; 


  faFacebook = faFacebook; 
  faTwitter = faTwitter;

  @Input() rawCardData: any;
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  	this.source = this.rawCardData['source'];
  	this.desc = this.rawCardData['description'];
  	this.title = this.rawCardData['title'];
  	this.img_url = this.rawCardData['urlToImage'];
  	this.url = this.rawCardData['url'];
  	let rawDate = new Date(this.rawCardData['publishedDate']);
    let options = {year: 'numeric', month: 'long', day: 'numeric' };
    this.date = rawDate.toLocaleString('en-US', options);
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
