import { Component, Input, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Forecast } from './forecast.type';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent implements OnInit {

  @Input() zipcode: string;
  forecast: Forecast;

  constructor(protected weatherService: WeatherService) {}

  ngOnInit() {
    this.weatherService.getForecast(this.zipcode).subscribe(data => this.forecast = data);
  }
}
