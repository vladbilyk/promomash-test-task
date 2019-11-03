import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AccountComponent } from './account.component';
import { Credentials } from '../../model/credentials';
import { UserCheckService } from '../../services/usercheck.service';

class MockUserCheckService extends UserCheckService {
    isUsernameFree(username: string): Observable<boolean> {
        return of(username !== 'registered@example.com');
    }
}

describe('AccountComponent',
    () => {
        let component: AccountComponent;
        let fixture: ComponentFixture<AccountComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [
                    FormsModule,
                    ReactiveFormsModule,
                    BrowserAnimationsModule,
                    MatButtonModule,
                    MatCardModule,
                    MatCheckboxModule,
                    MatFormFieldModule,
                    MatInputModule,
                    HttpClientTestingModule,
                ],
                declarations: [AccountComponent],
                providers: [UserCheckService]
            });

            TestBed.overrideComponent(AccountComponent,
                    { set: { providers: [{ provide: UserCheckService, useClass: MockUserCheckService }] } })
                .compileComponents();

        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AccountComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should create',
            () => {
                expect(component).toBeTruthy();
            });

        it('form invalid when empty',
            () => {
                expect(component.accountForm.valid).toBeFalsy();
            });

        it('email field is required',
            () => {
                const email = component.accountForm.controls.email;
                expect(email.valid).toBeFalsy();

                const errors = email.errors || {};
                expect(errors.required).toBeTruthy();

                email.setValue('  ');
                expect(email.valid).toBeFalsy();
            });

        it('email field must have correct format',
            () => {
                const email = component.accountForm.controls.email;

                // Set email to something
                email.setValue('test');
                let errors = email.errors || {};
                expect(errors.required).toBeFalsy();
                expect(errors.email).toBeTruthy();

                // Set email to something correct
                email.setValue('test@example.com');
                errors = email.errors || {};
                expect(errors.required).toBeFalsy();
                expect(errors.email).toBeFalsy();
            });

        it('email field must contains unregistered email',
            () => {
                const email = component.accountForm.controls.email;

                email.setValue('registered@example.com');
                let errors = email.errors || {};
                expect(errors.required).toBeFalsy();
                expect(errors.email).toBeFalsy();
                expect(errors.emailRegistered).toBeTruthy();

                email.setValue('unregistered@example.com');
                errors = email.errors || {};
                expect(errors.required).toBeFalsy();
                expect(errors.email).toBeFalsy();
                expect(errors.emailRegistered).toBeFalsy();
            });

        it('password field is required',
            () => {
                const password = component.accountForm.controls.password;
                expect(password.valid).toBeFalsy();

                const errors = password.errors || {};
                expect(errors.required).toBeTruthy();
            });

        const invalidPassword = [
            '21212',
            'sfddfsdfs121212dsfdf',
            'sfddfsdf',
            '1231231sfddfsdf',
            'sfddfsdf2342',
        ];

        invalidPassword.forEach((test, index) => {
            it(`invalid password ${test} (testcase: ${index + 1})`,
                () => {
                    const password = component.accountForm.controls.password;
                    password.setValue(test);
                    expect(password.valid).toBeFalsy();
                });
        });

        const validPassword = [
            '21212vffgV',
            'sfddVfsdfs121212dsfdf',
            '1V',
            'V1',
        ];

        validPassword.forEach((test, index) => {
            it(`valid password ${test} (testcase: ${index + 1})`,
                () => {
                    const password = component.accountForm.controls.password;
                    password.setValue(test);
                    expect(password.valid).toBeTruthy();
                });
        });

        it('agree field is required',
            () => {
                const agree = component.accountForm.controls.agree;
                expect(agree.valid).toBeTruthy();

                agree.setValue(false);
                const errors = agree.errors || {};
                expect(errors.required).toBeTruthy();
            });

        it('confirm password field is required',
            () => {
                const confirmation = component.accountForm.controls.passwordConfirmation;
                expect(confirmation.valid).toBeFalsy();

                const errors = confirmation.errors || {};
                expect(errors.required).toBeTruthy();
            });

        it('confirm password field must be the same as password',
            () => {
                const password = component.accountForm.controls.password;
                const confirmation = component.accountForm.controls.passwordConfirmation;

                password.setValue('123456');
                confirmation.setValue('123');

                let errors = confirmation.errors || {};
                expect(errors.mustMatch).toBeTruthy();

                confirmation.setValue('123456');
                errors = confirmation.errors || {};
                expect(errors.mustMatch).toBeFalsy();
            });

        it('submitting a form emits the credentials',
            () => {
                expect(component.accountForm.valid).toBeFalsy();
                component.accountForm.controls.email.setValue('test@test.com');
                component.accountForm.controls.password.setValue('123V');
                component.accountForm.controls.passwordConfirmation.setValue('123V');
                expect(component.accountForm.valid).toBeTruthy();

                let creds: Credentials;
                // Subscribe to the Observable and store the user in a local variable.
                component.submitted.subscribe((value) => creds = value);

                // Trigger the login function
                component.onSubmit();

                // Now we can check to make sure the emitted value is correct
                expect(creds.email).toBe('test@test.com');
                expect(creds.password).toBe('123V');
            });

    });
