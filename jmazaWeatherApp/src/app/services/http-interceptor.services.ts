import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse, HttpResponse }
  from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { LocationService } from './location.service';
import { SearchErrorService } from './search-error.service';
import { HttpCacheService } from './http-cache.service';

@Injectable()
export class WeatherHttpInterceptor implements HttpInterceptor {

    constructor(
      private locationService: LocationService,
      private searchErrorService: SearchErrorService,
      private cacheService: HttpCacheService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let url = req.url;

      // Attempt to retrieve a cached response
      const cachedResponse: HttpResponse<any> | HttpErrorResponse | null = this.cacheService.get(url);

      // Return cached response
      if(cachedResponse) {

        // The cached response is an error
        if (cachedResponse['error']) {

          if(cachedResponse.status === 400) {
            this.searchErrorService.setErrorMsg('Incorrect Search!');
          }

          if(cachedResponse.status === 404) {
            this.searchErrorService.setErrorMsg('Zip Code not found!');
          }

          const zipcode = req.url.match('zip=' + "(.*)" + ',us')[1].trim();
          this.locationService.removeLocation(zipcode);
          return throwError(() => cachedResponse);
        }

        return of(new HttpResponse(cachedResponse));
      }

      return next.handle(req)
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && event.status === 200) {
            this.cacheService.put(url, event);
            this.searchErrorService.setErrorMsg('');
          }
          return event;
        }),
        catchError((error: HttpErrorResponse) => {

          this.cacheService.put(url, error);

          if(error.status === 400) {
            this.searchErrorService.setErrorMsg('Incorrect Search!');
          } 

          if(error.status === 404) {
            this.searchErrorService.setErrorMsg('Zip Code not found!');
          } 

          // If the zipcode is not correct or does not exist, we delete it from the localstorage 
          // to prevent it from trying to search for it in each connection, since it does not show the
          // corresponding tab, we cannot delete it from the application
          const zipcode = req.url.match('zip=' + "(.*)" + ',us')[1].trim();
            
          if (zipcode) {
            this.locationService.removeLocation(zipcode);
          }
                
          return throwError(() => new Error(error.message));
        })
      );
    }
}