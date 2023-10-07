import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";



@Injectable(
   { providedIn: 'root' }
)
export class SearchErrorService {

   public static readonly NO_ERROR = '';
   public static readonly REFRESH_ERROR = 'The minimum refresh time is 1 second!';
   public static readonly SEARCH_ERROR = 'Incorrect Search!';
   public static readonly ZIP_SEARCH_ERROR = 'Zip Code not found!';
   public static readonly ZIP_ALREADY_PRESENT_ERROR = 'The zipcode is already in the list of results!';

   $errorMsg: Subject<string> = new Subject();

   getErrorMsg(): Observable<string> {
      return this.$errorMsg.asObservable();
   }

   setErrorMsg(error: string): void {
      this.$errorMsg.next(error);
   }

}