import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

import { AddressService } from '../../services/address.service';
import { Country } from '../../services/Country';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

    @Output() saved = new EventEmitter<string>();

    addressForm = this.fb.group({
        countryControl: ['', [Validators.required]],
        provinceControl: ['', [Validators.required]],
    });

    constructor(private fb: FormBuilder,
        private addressService: AddressService) { }

    ngOnInit() {
        this.addressService.getCountries().subscribe(countries => this.countries = countries);
    }

    onSubmit() {
        if (this.addressForm.valid) {
            const country = this.addressForm.controls.countryControl.value.title;
            const province = this.addressForm.controls.provinceControl.value;
            this.saved.emit(`${country}, ${province}`);
        }
    }

    countries: Country[] = [];

    provinces: string[] = [];

    selectCountry(e: MatSelectChange) {
        this.addressService.getProvinces(e.value.code)
            .subscribe(provinces => {
                this.provinces = provinces;
                this.addressForm.controls.provinceControl.setValue('');
            })
    }
}
