import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SignupRequest } from './SignupRequest';

@Injectable({
    providedIn: 'root'
})
export class SignupService {

    usersUrl = environment.signupApi;

    constructor(private http: HttpClient) {}

    signup(request: SignupRequest): Observable<boolean> {
        return this.http.post<boolean>(this.usersUrl, request);
    }

}
