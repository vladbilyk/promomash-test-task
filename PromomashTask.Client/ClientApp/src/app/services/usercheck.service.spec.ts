import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserCheckService } from './usercheck.service';

describe('UserCheckService',
    () => {
        beforeEach(() => TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        }));

        it('should be created',
            () => {
                const service: UserCheckService = TestBed.get(UserCheckService);
                expect(service).toBeTruthy();
            });
    });
