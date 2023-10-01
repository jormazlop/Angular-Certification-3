import { Component, OnDestroy } from '@angular/core';
import { LocationService } from "../services/location.service";
import { WeatherService } from 'app/services/weather.service';
import { Subscription } from 'rxjs';
import { SearchErrorService } from 'app/services/search-error.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  styleUrls: ['./zipcode-entry.component.css']
})
export class ZipcodeEntryComponent implements OnDestroy {

  locationSubscription: Subscription = new Subscription();
  locations: string[] = [];

  constructor(
    private locationService: LocationService,
    private weatherService: WeatherService,
    private searchErrorService: SearchErrorService
  ) {
    this.locationSubscription = locationService.getLocations().subscribe((locations: string[]) => {
      this.locations = locations;
    });
  }

  addLocation(zipcode : string): void {

    // We check that there are no duplicate codes in the list of results
    if(!this.locations.includes(zipcode)) {
      this.locationService.addLocation(zipcode);
      this.weatherService.addCurrentConditions(zipcode);
    } else {
      this.searchErrorService.setErrorMsg('The zip code is already in the list of results!');
    }
  }

  removeAllLocation(): void {
    this.locationService.removeAll();
    this.weatherService.removeAllConditions();
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
  }

}
