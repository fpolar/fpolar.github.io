import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { StockSearchComponent } from './stock-search/stock-search.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ChartComponent } from './components/chart/chart.component';

const routes: Routes = [
	{path:'test', component: ChartComponent},
	{path:'details/:tick', component: DetailsComponent},
	{path:'watchlist', component: WatchlistComponent},
	{path:'portfolio', component: PortfolioComponent},
	{path:'', component: StockSearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
