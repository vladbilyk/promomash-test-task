import { Component, OnInit } from "@angular/core";

import { Credentials } from "../../model/credentials";
import { SignupService } from "../../services/signup.service";
import { UserCheckService } from "../../services/usercheck.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";

import { map, switchMap } from "rxjs/operators";
import { timer } from "rxjs";

import { MustMatch, AtleastOneCapLetterAndOneDigit } from "../validators";

const DEBOUNCING_DELAY = 1000;

@Component({
    selector: "app-registration",
    templateUrl: "./registration.component.html",
    styleUrls: ["./registration.component.css"]
})
export class RegistrationComponent implements OnInit {

    constructor(private signupService: SignupService,
        private userCheckService: UserCheckService,
        private fb: FormBuilder) {
    }

    address = this.fb.group({
        country: ["", [Validators.required]],
        province: ["", [Validators.required]],
    });

    account = this.fb.group({
            email: ["", [Validators.required, Validators.email], this.validateEmailIsFree.bind(this)],
            password: ["", [Validators.required, AtleastOneCapLetterAndOneDigit]],
            passwordConfirmation: ["", Validators.required],
            agree: [true, Validators.requiredTrue]
        },
        { validator: MustMatch("password", "passwordConfirmation") });

    step = 1;
    credentials: Credentials = null;

    ngOnInit() {
    }

    isFirstStep(): boolean {
        return this.step === 1;
    }

    isSecondStep(): boolean {
        return this.step === 2;
    }

    isSuceededStep(): boolean {
        return this.step === 3;
    }

    isErrorStep(): boolean {
        return this.step === 4;
    }

    completeFirstStep(creds: Credentials) {
        this.step = 2;
        this.credentials = creds;
    }

    saveUser(address: string) {
        const { email, password } = this.credentials;
        this.signupService.signup({ email, password, address })
            .subscribe(ok => {
                if (ok) {
                    this.step = 3;
                } else {
                    this.step = 4;
                }
            });
    }

    reset() {
        this.step = 1;
        this.credentials = null;
    }

    validateEmailIsFree(control: FormControl) {
        return timer(DEBOUNCING_DELAY).pipe(switchMap(() => {
            return this.userCheckService.isUsernameFree(control.value)
                .pipe(map(free => free ? null : { emailRegistered: control.value }));
        }));
    }
}
