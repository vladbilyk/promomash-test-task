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
import { MatSelectModule } from '@angular/material/select';

import { AccountComponent } from '../account/account.component';
import { AddressComponent } from '../address/address.component';
import { RegistrationComponent } from './registration.component';
import { UserCheckService } from '../../services/usercheck.service';

class MockUserCheckService extends UserCheckService {
    isUsernameFree(username: string): Observable<boolean> {
        return of(username !== 'registered@example.com');
    }
}

describe('RegistrationComponent', () => {
    let component: RegistrationComponent;
    let fixture: ComponentFixture<RegistrationComponent>;

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
                MatSelectModule,
                HttpClientTestingModule,
            ],
            declarations: [RegistrationComponent, AccountComponent, AddressComponent],
            providers: [UserCheckService]
        });

        TestBed.overrideComponent(AccountComponent, { set: { providers: [{ provide: UserCheckService, useClass: MockUserCheckService }] } })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
