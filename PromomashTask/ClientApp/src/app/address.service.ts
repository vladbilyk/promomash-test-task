import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Country {
    code: string,
    title: string
}

@Injectable({
    providedIn: 'root'
})
export class AddressService {

    countriesUrl : string = '/api/countries';

    constructor(private http: HttpClient,) { }

    getCountries() : Observable<Country[]> {
        return this.http.get<Country[]>(this.countriesUrl);
    }

    getProvinces(code: string) : Observable<string[]> {
        return this.http.get<string[]>(`/api/countries/${code}/provinces`);
    }
}
