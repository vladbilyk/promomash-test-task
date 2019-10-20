import { Component, OnInit } from '@angular/core';

import { Credentials } from '../credentials';
import { SignupService } from '../services/signup.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

    step: number = 1;
    credentials : Credentials = null;

    constructor(private signupService: SignupService) { }

    ngOnInit() {
    }

    isFirstStep() : boolean {
        return this.step === 1;
    }

    isSecondStep() : boolean {
        return this.step === 2;
    }

    isSuceededStep() : boolean {
        return this.step === 3;
    }

    isErrorStep() : boolean {
        return this.step === 4;
    }

    completeFirstStep(creds : Credentials) {
        this.step = 2;
        this.credentials = creds;
    }

    saveUser(address: string) {
        let { email, password } = this.credentials;
        this.signupService.signup({ email, password, address })
            .subscribe( ok => {
                if (ok) {
                    this.step = 3;
                }
                else {
                    this.step = 4;
                }
            });
    }

    reset() {
        this.step = 1;
        this.credentials = null;       
    }

}
