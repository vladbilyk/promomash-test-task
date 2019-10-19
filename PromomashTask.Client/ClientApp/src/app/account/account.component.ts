import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { map, switchMap } from 'rxjs/operators';
import { timer } from 'rxjs'; 

import { Credentials } from '../credentials';
import { UserCheckService } from '../usercheck.service';

// https://jasonwatmore.com/post/2018/11/07/angular-7-reactive-forms-validation-example
function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}

function AtleastOneCapLetterAndOneDigit(control: FormControl) {
    const ok = /\d/.test(control.value) && /[A-Z]/.test(control.value);
    return !ok ? { custompassword: { value: control.value } } : null;
}

const DEBOUNCING_DELAY: number = 1000;

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

    @Output() submitted = new EventEmitter<Credentials>();

    accountForm = this.fb.group({
        email: ['', [Validators.required, Validators.email], this.validateEmailIsFree.bind(this)],
        password: ['', [Validators.required, AtleastOneCapLetterAndOneDigit]],
        passwordConfirmation: ['', Validators.required],
        agree: [true, Validators.requiredTrue]
    }, { validator: MustMatch('password', 'passwordConfirmation') });

    constructor(private fb: FormBuilder,
                private userCheckService: UserCheckService) { }

    ngOnInit() {
    }

    onSubmit() {
        if (this.accountForm.valid) {
            const creds = new Credentials();
            creds.email = this.accountForm.controls.email.value;
            creds.password = this.accountForm.controls.password.value;
            this.submitted.emit(creds);
        }
    }

    emailError() {
        return this.accountForm.controls.email.hasError('required') ? 'You must enter a value' :
            this.accountForm.controls.email.hasError('email') ? 'Not a valid email' :
                this.accountForm.controls.email.hasError('emailRegistered') ? 'This email is registered already' :
                    null;
    }

    passwordError() {
        return this.accountForm.controls.password.hasError('required') ? 'You must enter a value' :
            this.accountForm.controls.password.hasError('custompassword') ? 'Password must contains at least 1 digit and 1 capital letter' :
                null;
    }

    passwordConfirmationError() {
        return this.accountForm.controls.passwordConfirmation.hasError('required') ? 'You must enter a value' :
            this.accountForm.controls.passwordConfirmation.hasError('mustMatch') ? 'Passwords does not match' :
                null;
    }

    agreeError() {
        return this.accountForm.controls.agree.hasError('required') ? 'You must agree with Policy' :
            null;
    }

    validateEmailIsFree(control: FormControl) {
      return timer(DEBOUNCING_DELAY).pipe(switchMap(() => {
        return this.userCheckService.isUsernameFree(control.value)
          .pipe(map(free => free ? null : { emailRegistered: control.value }));
      }));
    }
}
