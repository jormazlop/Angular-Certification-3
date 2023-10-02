import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

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

    _refreshCache = 7200000;

    constructor() {
        let requestsString = localStorage.getItem(CACHED_REQUESTS);
        this.cachedRequest = requestsString ? JSON.parse(requestsString): [];
    }

    public put(url: string, response: HttpResponse<any>): void {
        this.cachedRequest.push({url, response});
        localStorage.setItem(CACHED_REQUESTS, JSON.stringify(this.cachedRequest));
    }

    public putError(url: string, response: HttpErrorResponse): void {
        this.cachedRequest.push({url, response});
        localStorage.setItem(CACHED_REQUESTS, JSON.stringify(this.cachedRequest));
    }
   
    public get(url: string): HttpResponse<any>| HttpErrorResponse | null {

        const response = this.cachedRequest.filter((req: CachedResponse) => req.url === url)
                                           .map((req: CachedResponse) => req.response)[0];

        return response;
    }
}