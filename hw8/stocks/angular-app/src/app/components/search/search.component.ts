import { Component, OnInit } from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map, startWith, debounceTime, tap,distinctUntilChanged, switchMap, finalize} from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';

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
	// filteredOptions: Observable<string[]>;
	isLoading = false;
    errorMsg: string;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
 //  	this.currentDBUserBS$ = this.myControl.valueChanges;
	// this.currentDBUserBS$.subscribe(data => {
 //        console.log('s');
 //        if (data['Search'] == undefined) {
 //          this.errorMsg = data['Error'];
 //          this.filteredOptions = [];
 //        } else {
 //          this.errorMsg = "";
 //          this.filteredOptions = data['Search'];
 //        }

 //        console.log(this.filteredOptions);
 //      });

	this.myControl.valueChanges
	  .pipe(
	    debounceTime(500),
	    tap(() => {
	      console.log('t');
	      this.errorMsg = "";
	      this.filteredOptions = [];
	      this.isLoading = true;
	    }),
	    switchMap(value => this.http.get("http://localhost:3000/api/tick-search/" + value)
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
	  });
  }
}
