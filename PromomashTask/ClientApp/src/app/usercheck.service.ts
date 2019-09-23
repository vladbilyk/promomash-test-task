import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class UserCheckService {

    constructor(private http: HttpClient) { }

    isUsernameFree(username: string): Observable<boolean> {
        return this.http.get<boolean>(`/api/isUsernameFree/${username}`);
    }
}
