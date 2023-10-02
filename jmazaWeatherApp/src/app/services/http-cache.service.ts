import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subscription, interval } from "rxjs";

export interface CachedResponse {
    url: string;
    response: HttpResponse<any> | HttpErrorResponse;
}

export const CACHED_REQUESTS : string = "cached_requests";

@Injectable(
    { providedIn: 'root' }
)
export class HttpCacheService {

    cachedRequest: CachedResponse[] = [];

    // Cache refresh time is initialized to 2 hours.
    _refreshCache = 7200000;

    refreshCacheInterval: Subscription;

    constructor() {
        let requestsString = localStorage.getItem(CACHED_REQUESTS);
        this.cachedRequest = requestsString ? JSON.parse(requestsString): [];

        this.refreshCacheInterval = interval(this._refreshCache).subscribe(() => {
            this.clearCache();
        });
    }

    // The cache is saved in the browser's local storage
    // get -> We check if we have already performed a previous search to this url
    // put -> We save the url and the response in the storage

    get(url: string): HttpResponse<any> | HttpErrorResponse | null {
        const response = this.cachedRequest.filter((req: CachedResponse) => req.url === url)
                                           .map((req: CachedResponse) => req.response)[0];

        return response;
    }

    put(url: string, response: HttpResponse<any> | HttpErrorResponse): void {
        this.cachedRequest.push({url, response});
        localStorage.setItem(CACHED_REQUESTS, JSON.stringify(this.cachedRequest));
    }

    setRefreshCache(refreshCache: number): void {
        this._refreshCache = refreshCache;

        this.refreshCacheInterval = interval(this._refreshCache).subscribe(() => {
            this.clearCache();
        });
    }

    private clearCache(): void {
        localStorage.setItem(CACHED_REQUESTS, JSON.stringify([]));
    }
}