import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";

import { AddressService } from "../../services/address.service";
import { Country } from "../../services/Country";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "app-address",
    templateUrl: "./address.component.html",
    styleUrls: ["./address.component.css"]
})
export class AddressComponent implements OnInit {

    constructor(private addressService: AddressService) {}

    @Input()
    address: FormGroup;

    @Output()
    saved = new EventEmitter<string>();

    ngOnInit() {
        this.addressService.getCountries().subscribe(countries => this.countries = countries);
    }

    onSubmit() {
        if (this.address.valid) {
            const country = this.address.controls["country"].value;
            const province = this.address.controls["province"].value;
            this.saved.emit(`${country}, ${province}`);
        }
    }

    countries: Country[] = [];

    provinces: string[] = [];

    selectCountry(e: MatSelectChange) {
        this.addressService.getProvinces(e.value.code)
            .subscribe(provinces => {
                this.provinces = provinces;
                this.address.controls["province"].setValue("");
            });
    }
}
