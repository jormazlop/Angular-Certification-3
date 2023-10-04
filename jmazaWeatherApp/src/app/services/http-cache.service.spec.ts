import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherHttpInterceptor } from "./http-interceptor.services";
import { HTTP_INTERCEPTORS, HttpErrorResponse } from "@angular/common/http";
import { WeatherService } from "./weather.service";
import { HttpCacheService } from "./http-cache.service";

describe('HttpInterceptorService', () => {

   let weatherService: WeatherService;
   let httpMock: HttpTestingController
   let cacheService: HttpCacheService;
 
   beforeEach(()=> {
     TestBed.configureTestingModule({
       imports: [ HttpClientTestingModule ],
       providers: [
         WeatherService,
         HttpCacheService,
        { provide: HTTP_INTERCEPTORS, useClass: WeatherHttpInterceptor, multi: true },
       ]
     });
     httpMock = TestBed.inject(HttpTestingController)
     weatherService = TestBed.inject(WeatherService);
     cacheService = TestBed.inject(HttpCacheService);

     cacheService.clearCache();
   });
 
   it('The first http call is always made', ()=> {
      const zipCode = '11111';
      const testUrl = `${WeatherService.URL}/forecast/daily?zip=${zipCode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;

      const serviceUnavailable = new HttpErrorResponse({
         status: 404,
         statusText: 'Not Found',
         url: testUrl
       });

      weatherService.getForecast(zipCode).subscribe((response: any) => {
        expect(response).toBeInstanceOf(HttpErrorResponse);
        expect(response).toBe(serviceUnavailable);
      });

      const request = httpMock.expectOne(testUrl);
      request.flush(serviceUnavailable);
    });

    it('The second http call to the same url is cached', ()=> {
      const zipCode = '11111';
      const testUrl = `${WeatherService.URL}/forecast/daily?zip=${zipCode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;

      const serviceUnavailable = new HttpErrorResponse({
         status: 404,
         statusText: 'Not Found',
         url: testUrl
       });

      weatherService.getForecast(zipCode).subscribe((response: any) => {
        expect(response).toBeInstanceOf(HttpErrorResponse);
        expect(response).toBe(serviceUnavailable);
      });

      // We expect the first call to be made
      const request = httpMock.expectOne(testUrl);
      request.flush(serviceUnavailable);

      weatherService.getForecast(zipCode).subscribe((response: any) => {
        expect(response).toBeInstanceOf(HttpErrorResponse);
        expect(response).toBe(serviceUnavailable);
      });

      // The second call is not made, because the response is already in the cache
      httpMock.expectNone(testUrl);
    });


    it('We call the method clearCache and verify the cache is cleared', () => {
      const zipCode = '11111';
      const testUrl = `${WeatherService.URL}/forecast/daily?zip=${zipCode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;

      const serviceUnavailable = new HttpErrorResponse({
         status: 404,
         statusText: 'Not Found',
         url: testUrl
       });

      weatherService.getForecast(zipCode).subscribe((response: any) => {
        expect(response).toBeInstanceOf(HttpErrorResponse);
        expect(response).toBe(serviceUnavailable);
      });

      // We expect the first call to be made
      const request = httpMock.expectOne(testUrl);
      request.flush(serviceUnavailable);

      cacheService.clearCache();

      weatherService.getForecast(zipCode).subscribe((response: any) => {
        expect(response).toBeInstanceOf(HttpErrorResponse);
        expect(response).toBe(serviceUnavailable);
      });

      // We expect the first call to be made
      httpMock.expectOne(testUrl);

    });
});