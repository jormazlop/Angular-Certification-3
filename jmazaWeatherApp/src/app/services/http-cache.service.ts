import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subscription, timer } from "rxjs";

export interface CachedResponse {
    url: string;
    response: HttpResponse<any> | HttpErrorResponse;
}

export interface CacheRefresh {
    lastTime: number;
    cacheDuration: number;
}

export const CACHED_REQUESTS : string = "cached_requests";
export const REFRESH_CACHE : string = "refresh_cache";

@Injectable(
    { providedIn: 'root' }
)
export class HttpCacheService {

    cachedRequest: CachedResponse[] = [];

    // Cache refresh time is initialized to 2 hours.
    refreshCache: CacheRefresh = { cacheDuration: 72000, lastTime: Date.now() }
    $refreshCache = new BehaviorSubject(this.refreshCache);
    timerCache: Subscription;

    constructor() {
        let requestsString = localStorage.getItem(CACHED_REQUESTS);
        this.cachedRequest = requestsString ? JSON.parse(requestsString): [];

        this.initcacheRefresh();

        this.timerCache = timer(this.timeUntilNextRefresh()).subscribe(() => {  
            this.clearCache();
        });
    }

    // Check if we have already performed a previous search to this url
    get(url: string): HttpResponse<any> | HttpErrorResponse | null {
        const response = this.cachedRequest.filter((req: CachedResponse) => req.url === url)
                                           .map((req: CachedResponse) => req.response)[0];

        return response;
    }

    // We save the url and the response in the storage
    put(url: string, response: HttpResponse<any> | HttpErrorResponse): void {
        this.cachedRequest.push({url, response});
        localStorage.setItem(CACHED_REQUESTS, JSON.stringify(this.cachedRequest));
    }

    // We update the refresh time of the cache
    setRefreshCache(refreshCache: number): void {

        this.refreshCache.cacheDuration = refreshCache * 1000;
        this.$refreshCache.next(this.refreshCache);

        localStorage.setItem(REFRESH_CACHE, JSON.stringify(this.refreshCache));

        this.timerCache.unsubscribe();

        this.timerCache = timer(this.timeUntilNextRefresh()).subscribe(() => {
            this.clearCache();
        });
    }

    getRefreshCache(): Observable<CacheRefresh> {
        return this.$refreshCache.asObservable();
    }

    clearCache(): void {
        this.refreshCache.lastTime = Date.now();
        this.$refreshCache.next(this.refreshCache);
        localStorage.setItem(REFRESH_CACHE, JSON.stringify(this.refreshCache));
        localStorage.setItem(CACHED_REQUESTS, JSON.stringify([]));
        this.cachedRequest = [];

        this.timerCache.unsubscribe();

        this.timerCache = timer(this.timeUntilNextRefresh()).subscribe(() => {
            this.clearCache();
        });
    }

    private initcacheRefresh(): void {

        let refreshCache = localStorage.getItem(REFRESH_CACHE);

        if(!refreshCache) {
            localStorage.setItem(REFRESH_CACHE, JSON.stringify(this.refreshCache));
        } else {
            this.refreshCache = JSON.parse(refreshCache);
            this.$refreshCache.next(this.refreshCache);
        }
    }

    private timeUntilNextRefresh(): number {
        return Date.now() - this.refreshCache.lastTime >= this.refreshCache.cacheDuration 
            ? 0
            : this.refreshCache.cacheDuration - (Date.now() - this.refreshCache.lastTime);
    }
}