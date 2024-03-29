import { Component, OnInit } from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, tap,distinctUntilChanged, switchMap, finalize } from 'rxjs/operators';

import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
	myControl = new FormControl();
	public currentDBUserBS$: any;
	options: string[] = ['One', 'Two', 'Three'];
	filteredOptions: any;
	isLoading = false;
    errorMsg: string;
    spin = false;
	// gcpURL = "http://localhost:3000";
	gcpURL = 'https://angular-stocks.wn.r.appspot.com'
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
	this.myControl.valueChanges
	  .pipe(
	    debounceTime(1000),
	    tap(() => {
	      console.log('t');
	      this.errorMsg = "";
	      this.filteredOptions = [];
	      this.isLoading = true;
	  	  this.spin = true;
	    }),
	    switchMap(value => this.http.get(this.gcpURL+"/api/tick-search/" + value)
	      .pipe(
	        finalize(() => {
	   		  console.log('f');
	          this.isLoading = false
	        }),
	      )
	    )
	  )
	  .subscribe(data => {
	  	this.filteredOptions = data;
	  	this.spin = false;
	  });
  }

  onSubmit() {
  	 this.router.navigate(['/details/'+this.myControl.value]);
  	 //replace localhost with NODE server location, not angular
  	 //window.location.assign('http://localhost:3000/details/'+this.myControl.value);
  	 console.log('x');
  }
}
