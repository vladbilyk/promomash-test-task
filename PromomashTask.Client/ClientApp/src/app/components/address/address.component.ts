import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';

import { AddressService } from '../../services/address.service';
import { Country } from '../../services/Country';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

    constructor(private addressService: AddressService) {}

    @Input()
    address: FormGroup;

    @Output()
    saved = new EventEmitter<string>();

    countries: Observable<Country[]>;

    provinces: Observable<string[]>;


    ngOnInit() {
        this.countries = this.addressService.getCountries();
    }

    onSubmit() {
        if (this.address.valid) {
            const country = this.address.controls['country'].value;
            const province = this.address.controls['province'].value;
            this.saved.emit(`${country}, ${province}`);
        }
    }

    selectCountry(e: MatSelectChange) {
        this.address.controls['province'].setValue('');
        this.provinces = this.addressService.getProvinces(e.value.code);
    }
}
