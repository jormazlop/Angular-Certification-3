import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastsListComponent } from './forecasts-list.component';
import { ForecastsListRoutingModule } from './forecasts-list.routing.module';

@NgModule({
  declarations: [
    ForecastsListComponent
  ],
  imports: [
    CommonModule,
    ForecastsListRoutingModule
  ]
})
export class ForecastsListModule {}
