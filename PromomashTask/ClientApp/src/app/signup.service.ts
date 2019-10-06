import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface SignupRequest {
    email: string,
    password: string,
    address: string
}

@Injectable({
    providedIn: 'root'
})
export class SignupService {

    usersUrl: string = '/api/users';

    constructor(private http: HttpClient) { }

    signup(request: SignupRequest): Observable<boolean> {
        return this.http.post<boolean>(this.usersUrl, request);
    }

}