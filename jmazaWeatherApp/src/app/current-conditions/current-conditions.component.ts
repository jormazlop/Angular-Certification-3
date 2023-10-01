import { ChangeDetectionStrategy, Component, OnDestroy, Signal } from '@angular/core';
import { WeatherService } from "../services/weather.service";
import { LocationService } from "../services/location.service";
import { Router } from "@angular/router";
import { ConditionsAndZip } from '../conditions-and-zip.type';
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

  constructor(
    protected weatherService: WeatherService,
    private locationService: LocationService,
    private router: Router
  ) {
    this.locationSubscription = locationService.getLocations().subscribe((locations: string[]) => {
      if(!locations.includes(this.selectedLocation?.zip)) {
        this.selectedLocation = null;
      }
    });
  }

  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }

  removeLocation(zipcode : string) {
    this.locationService.removeLocation(zipcode);
    this.weatherService.removeCurrentConditions(zipcode);
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
  }
}
