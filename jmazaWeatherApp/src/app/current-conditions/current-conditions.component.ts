import { ChangeDetectionStrategy, Component, OnDestroy, Signal } from '@angular/core';
import { WeatherService } from "../services/weather.service";
import { LocationService } from "../services/location.service";
import { Router } from "@angular/router";
import { ConditionsAndZip } from '../types/conditions-and-zip.type';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentConditionsComponent implements OnDestroy {

  locationSubscription: Subscription = new Subscription();
  selectedLocation;

  conditionsTabStyle = {
    'align-items': 'center',
    'display': 'flex',
    'justify-content': 'space-between',
    'padding': '25px 50px'
  };

  constructor(
    protected weatherService: WeatherService,
    private locationService: LocationService,
    private router: Router
  ) {
    // We check, with each new emision of the list of locations,
    // if the selected location has been deleted (Button X or Remove locations)
    this.locationSubscription = locationService.getLocations().subscribe((locations: string[]) => {
      if(!locations.includes(this.selectedLocation?.zip)) {
        this.selectedLocation = null;
      }
    });
  };

  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  protected showForecast(zipcode : string): void {
    this.router.navigate(['/forecast', zipcode])
  };

  protected removeLocation(zipcode : string): void {
    this.locationService.removeLocation(zipcode);
    this.weatherService.removeCurrentConditions(zipcode);
  };

  protected trackLocation(index : number, location: ConditionsAndZip): string | undefined {
    return location ? location.zip : undefined;
  };

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
  };
}
