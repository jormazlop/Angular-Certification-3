import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable(
   { providedIn: 'root' }
)
export class SearchErrorService {

   $errorMsg: Subject<string> = new Subject();

   getErrorMsg(): Observable<string> {
      return this.$errorMsg.asObservable();
   }

   setErrorMsg(error: string): void {
      this.$errorMsg.next(error);
   }

}