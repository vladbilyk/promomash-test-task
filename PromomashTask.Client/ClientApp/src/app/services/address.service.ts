import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Country } from './Country';

@Injectable({
    providedIn: 'root'
})
export class AddressService {

    countriesUrl: string = environment.countriesApi;

    constructor(private http: HttpClient) { }

    getCountries() : Observable<Country[]> {
        return this.http.get<Country[]>(this.countriesUrl);
    }

    getProvinces(code: string) : Observable<string[]> {
        return this.http.get<string[]>(`${this.countriesUrl}/${code}/provinces`);
    }
}
