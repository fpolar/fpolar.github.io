import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule,FormControl, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HighchartsChartModule } from "highcharts-angular";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NavComponent } from './components/nav/nav.component';
import { SearchComponent } from './components/search/search.component';
import { ConfigService } from './services/config.service';
import { DetailsComponent } from './details/details.component';
import { StockSearchComponent } from './stock-search/stock-search.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { FooterComponent } from './components/footer/footer.component';
import { CardComponent } from './components/card/card.component';
import { PcardComponent } from './components/pcard/pcard.component';
import { WcardComponent } from './components/wcard/wcard.component';
import { AlertModule } from './components/_alert';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SearchComponent,
    DetailsComponent,
    StockSearchComponent,
    WatchlistComponent,
    PortfolioComponent,
    FooterComponent,
    CardComponent,
    PcardComponent,
    WcardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    AppRoutingModule,
    NoopAnimationsModule,
    MatAutocompleteModule,
    NgbModule,
    MatInputModule,
    FormsModule,
	MatProgressSpinnerModule,
	BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTabsModule,
    FontAwesomeModule,
    HighchartsChartModule,
    AlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
