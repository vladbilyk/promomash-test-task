import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class UserCheckService {
    userCheckUrl: string = environment.userCheckApi;

    constructor(private http: HttpClient) { }

    isUsernameFree(username: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.userCheckUrl}/${username}`);
    }
}
