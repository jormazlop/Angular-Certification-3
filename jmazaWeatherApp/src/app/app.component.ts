import { Component } from '@angular/core';
import { LOCATIONS, LocationService } from './services/location.service';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private locationService : LocationService, private weatherService: WeatherService) {

      // When starting the application it checks if there are locations stored in the search cache
      let locString = localStorage.getItem(LOCATIONS);

      const locations = locString ? JSON.parse(locString).filter(loc => loc): [];

      locations.forEach(loc => {
        const zipcode = loc;
        this.locationService.addLocation(zipcode);
        this.weatherService.addCurrentConditions(zipcode);
      });
    }
}
