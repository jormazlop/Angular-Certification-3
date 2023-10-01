import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export const LOCATIONS : string = "locations";

@Injectable(
  { providedIn: 'root' }
)
export class LocationService {

  locations : string[] = [];
  $location: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(this.locations);

  getLocations(): Observable<string[]> {
    return this.$location.asObservable();
  }

  addLocation(zipcode : string): void {
    this.locations.push(zipcode);
    this.$location.next(this.locations);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
  }

  removeLocation(zipcode : string): void {

    let index = this.locations.indexOf(zipcode);
    
    if (index !== -1){
      this.locations.splice(index, 1);
      this.$location.next(this.locations);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }

  removeAll(): void {
    this.locations = [];
    this.$location.next(this.locations);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
  }
}
