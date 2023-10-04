import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherHttpInterceptor } from "./http-interceptor.services";
import { HTTP_INTERCEPTORS, HttpErrorResponse } from "@angular/common/http";
import { WeatherService } from "./weather.service";
import { HttpCacheService } from "./http-cache.service";
import { firstValueFrom } from "rxjs";
import { SearchErrorService } from "./search-error.service";

describe('SearchErrorService', () => {

   let weatherService: WeatherService;
   let httpMock: HttpTestingController
   let searchErrorService: SearchErrorService;
   let cacheService: HttpCacheService;
 
   beforeEach(()=> {
     TestBed.configureTestingModule({
       imports: [ HttpClientTestingModule ],
       providers: [
         WeatherService,
         SearchErrorService,
         HttpCacheService,
        { provide: HTTP_INTERCEPTORS, useClass: WeatherHttpInterceptor, multi: true },
       ]
     });

     httpMock = TestBed.inject(HttpTestingController);
     weatherService = TestBed.inject(WeatherService);
     searchErrorService = TestBed.inject(SearchErrorService);
     cacheService = TestBed.inject(HttpCacheService);

     cacheService.clearCache();
   });
 
   it('Error Message when zip Code not found', ()=> {
      const zipCode = '11111';
      const testUrl = `${WeatherService.URL}/forecast/daily?zip=${zipCode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;

      searchErrorService.getErrorMsg().subscribe(message => {
         expect(message).toBe('Zip Code not found!');
      });
      
      firstValueFrom(weatherService.getForecast(zipCode)).catch((error: Error) => {
         console.log(error.message)
         expect(error.message).toContain('404');
      });

      const request = httpMock.expectOne(testUrl);
      request.error(new ErrorEvent('404'), { status: 404 });
   });

   it('Error Message when zip Code incorrect', ()=> {
      const zipCode = '11111';
      const testUrl = `${WeatherService.URL}/forecast/daily?zip=${zipCode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;

      searchErrorService.getErrorMsg().subscribe(message => {
         expect(message).toBe('Incorrect Search!');
      });
      
      firstValueFrom(weatherService.getForecast(zipCode)).catch((error: Error) => {
         console.log(error.message)
         expect(error.message).toContain('400');
      });

      const request = httpMock.expectOne(testUrl);
      request.error(new ErrorEvent('400'), { status: 400 });
   });

   it('Empty Message when zip Code correct', ()=> {
      const zipCode = '11111';
      const testUrl = `${WeatherService.URL}/forecast/daily?zip=${zipCode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;

      const serviceUnavailable = new HttpErrorResponse({
         status: 200,
         statusText: 'Zip Code found!',
         url: testUrl
      });

      searchErrorService.getErrorMsg().subscribe(message => {
         expect(message).toBe('');
      });
      
      firstValueFrom(weatherService.getForecast(zipCode));

      const request = httpMock.expectOne(testUrl);
      request.flush(serviceUnavailable);
   });

});