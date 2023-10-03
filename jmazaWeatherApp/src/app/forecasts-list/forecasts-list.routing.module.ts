import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForecastsListComponent } from './forecasts-list.component';

const routes: Routes = [
  { path: '', component: ForecastsListComponent, title: 'Forecasts' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForecastsListRoutingModule { }