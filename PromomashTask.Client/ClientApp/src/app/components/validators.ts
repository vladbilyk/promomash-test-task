import { FormControl, FormGroup } from '@angular/forms';

// https://jasonwatmore.com/post/2018/11/07/angular-7-reactive-forms-validation-example
export function MustMatch(controlName: string, matchingControlName: string) {
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

export function AtleastOneCapLetterAndOneDigit(control: FormControl) {
    const ok = /\d/.test(control.value) && /[A-Z]/.test(control.value);
    return !ok ? { custompassword: { value: control.value } } : null;
}
