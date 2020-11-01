import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { StockSearchComponent } from './stock-search/stock-search.component';

const routes: Routes = [
	{path:'details', component: DetailsComponent},
	{path:'', component: StockSearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
