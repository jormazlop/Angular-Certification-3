import { Component, HostListener, OnDestroy } from '@angular/core';
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
  zipcode: string = '';

  constructor(
    private locationService: LocationService,
    private weatherService: WeatherService,
    private searchErrorService: SearchErrorService
  ) {
    this.locationSubscription = locationService.getLocations().subscribe((locations: string[]) => {
      this.locations = locations;
    });
  }

  @HostListener('document:keyup', ['$event'])
  onEsc(event: KeyboardEvent) {
    if(event.key === 'Enter') {
      this.addLocation();
    }
  }

  addLocation(): void {

    // We check that there are no duplicate zipcodes in the list of results
    if(!this.locations.includes(this.zipcode)) {
      this.locationService.addLocation(this.zipcode);
      this.weatherService.addCurrentConditions(this.zipcode);
    } else {
      this.searchErrorService.setErrorMsg('The zipcode is already in the list of results!');
    }
  }

  removeAllLocation(): void {
    this.locationService.removeAll();
    this.weatherService.removeAllConditions();
    this.searchErrorService.setErrorMsg('');
    this.zipcode = '';
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
  }

}
