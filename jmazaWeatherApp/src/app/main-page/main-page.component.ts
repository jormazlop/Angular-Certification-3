import { Component } from '@angular/core';
import { CacheRefresh, HttpCacheService } from 'app/services/http-cache.service';
import { SearchErrorService } from 'app/services/search-error.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  $errorMsg: Observable<string>;
  $refreshCache: Observable<CacheRefresh>;

  constructor(
    protected searchErrorService: SearchErrorService,
    private cacheService: HttpCacheService
  ) {
    this.$errorMsg = this.searchErrorService.getErrorMsg();
    this.$refreshCache = this.cacheService.getRefreshCache();
  }

  onClickCloseMessage(): void {
    this.searchErrorService.setErrorMsg(SearchErrorService.NO_ERROR);
  }

  onClickUpdateCacheDuration(cacheDuration: string): void {

    const duration = Number(cacheDuration);

    if(duration < 1) {
      this.searchErrorService.setErrorMsg(SearchErrorService.REFRESH_ERROR);
    } else {
      this.searchErrorService.setErrorMsg(SearchErrorService.NO_ERROR);
      this.cacheService.setRefreshCache(duration);
    }
  }

  onClickClearCache(): void {
    this.searchErrorService.setErrorMsg(SearchErrorService.NO_ERROR);
    this.cacheService.clearCache();
  }
}
