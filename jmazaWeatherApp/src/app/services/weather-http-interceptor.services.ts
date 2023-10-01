import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse, HttpResponse }
  from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { LocationService } from './location.service';
import { SearchErrorService } from './search-error.service';

@Injectable()
export class WeatherHttpInterceptor implements HttpInterceptor {

    constructor(private locationService: LocationService, private searchErrorService: SearchErrorService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      return next.handle(req)
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && event.status === 200) {
            this.searchErrorService.setErrorMsg('');
          }
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          if(error.status === 404) {
            // If the zipcode does not exist, we delete it from the localstorage to prevent it
            // from trying to search for it in each connection, since it does not show the
            // corresponding tab, we cannot delete it from the application
            const zipcode = req.url.match('zip=' + "(.*)" + ',us')[1].trim();
            
            if (zipcode) {
              this.locationService.removeLocation(zipcode);
            }

            this.searchErrorService.setErrorMsg('Zip Code not found!');

          }        
           return throwError(() => new Error(error.message));
        })
      );
    }
}