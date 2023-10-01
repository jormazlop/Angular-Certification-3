import { Component } from '@angular/core';
import {LocationService} from "../services/location.service";
import { WeatherService } from 'app/services/weather.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private locationService : LocationService, private weatherService: WeatherService) { }

  addLocation(zipcode : string){
    this.locationService.addLocation(zipcode);
    this.weatherService.addCurrentConditions(zipcode);
  }

}
