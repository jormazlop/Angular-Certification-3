import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse }
  from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { LocationService } from './location.service';

@Injectable()
export class WeatherHttpInterceptor implements HttpInterceptor {

    constructor(private locationService: LocationService) {}

    intercept(req : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>> {

      return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {

          if(error.status === 404) {
            // If the zipcode does not exist, we delete it from the localstorage to prevent it
            // from trying to search for it in each connection, since it does not show the
            // corresponding tab, we cannot delete it from the application

            const zipcode = req.url.substring(req.url.indexOf('zip=') + 4, req.url.indexOf(',us'))
            
            if (zipcode) {
              this.locationService.removeLocation(zipcode)
            }
          }        
           return throwError(() => new Error(error.message));
        })
      );
    }
}