import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment"

@Injectable({
    providedIn: 'root'
})
export class SignupService {

    usersUrl: string = environment.signupApi;

    constructor(private http: HttpClient) { }

    signup(request: SignupRequest): Observable<boolean> {
        return this.http.post<boolean>(this.usersUrl, request);
    }

}
