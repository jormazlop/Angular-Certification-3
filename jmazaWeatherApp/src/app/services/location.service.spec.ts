import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocationService } from "./location.service";
import { firstValueFrom } from "rxjs";

describe('LocationService', () => {

   let locationService: LocationService;
   let httpMock: HttpTestingController
 
   beforeEach(()=> {
     TestBed.configureTestingModule({
       imports: [ HttpClientTestingModule ],
       providers: [
         LocationService,
       ]
     });
     httpMock = TestBed.inject(HttpTestingController)
     locationService = TestBed.inject(LocationService);

     locationService.removeAll();
   });
 
   it('Location observable emit value when we add a location', ()=> {

      const $location = locationService.getLocations();

      const zipCode = '11111';

      locationService.addLocation(zipCode);

      firstValueFrom($location).then(zip => {
        expect(zip[0]).toBe(zipCode);
      })
    });

    it('Location remove selected locations on method removeLocation', ()=> {

      const $location = locationService.getLocations();

      const zipCode1 = '11111';
      const zipCode2 = '11112';
      const zipCode3 = '11113';
      const zipCode4 = '11114';

      locationService.addLocation(zipCode1);
      locationService.addLocation(zipCode2);
      locationService.addLocation(zipCode3);
      locationService.addLocation(zipCode4);

      locationService.removeLocation(zipCode1);

      firstValueFrom($location).then(zip => {
        expect(zip).not.toContain(zipCode1);
        expect(zip).toContain(zipCode2);
        expect(zip).toContain(zipCode3);
        expect(zip).toContain(zipCode4);
      });
    });

    it('Location remove all locations on method removeAll', ()=> {

      const $location = locationService.getLocations();

      const zipCode1 = '11111';
      const zipCode2 = '11112';
      const zipCode3 = '11113';
      const zipCode4 = '11114';

      locationService.addLocation(zipCode1);
      locationService.addLocation(zipCode2);
      locationService.addLocation(zipCode3);
      locationService.addLocation(zipCode4);

      locationService.removeAll();

      firstValueFrom($location).then(zip => {
        expect(zip).toEqual([]);
      });
    });
});