import { Component } from '@angular/core';
import { SearchErrorService } from 'app/services/search-error.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  $errorMsg: Observable<string>;

  constructor(protected searchErrorService: SearchErrorService) {
    this.$errorMsg = this.searchErrorService.getErrorMsg();
  }
}
