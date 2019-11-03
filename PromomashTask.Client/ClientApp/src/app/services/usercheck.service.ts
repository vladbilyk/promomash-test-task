import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class UserCheckService {
    userCheckUrl = environment.userCheckApi;

    constructor(private http: HttpClient) {}

    isUsernameFree(username: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.userCheckUrl}/${username}`);
    }
}
