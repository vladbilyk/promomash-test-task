import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Credentials } from '../../model/credentials';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

    @Input()
    account: FormGroup;

    @Output()
    submitted = new EventEmitter<Credentials>();

    ngOnInit() {
    }

    onSubmit() {
        if (this.account.valid) {
            const creds = new Credentials();
            creds.email = this.account.controls['email'].value;
            creds.password = this.account.controls['password'].value;
            this.submitted.emit(creds);
        }
    }

    emailError() {
        return this.account.controls['email'].hasError('required')
            ? 'You must enter a value'
            : this.account.controls['email'].hasError('email')
            ? 'Not a valid email'
            : this.account.controls['email'].hasError('emailRegistered')
            ? 'This email is registered already'
            : null;
    }

    passwordError() {
        return this.account.controls['password'].hasError('required')
            ? 'You must enter a value'
            : this.account.controls['password'].hasError('custompassword')
            ? 'Password must contains at least 1 digit and 1 capital letter'
            : null;
    }

    passwordConfirmationError() {
        return this.account.controls['passwordConfirmation'].hasError('required')
            ? 'You must enter a value'
            : this.account.controls['passwordConfirmation'].hasError('mustMatch')
            ? 'Passwords does not match'
            : null;
    }

    agreeError() {
        return this.account.controls['agree'].hasError('required') ? 'You must agree with Policy' : null;
    }
}
