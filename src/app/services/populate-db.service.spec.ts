import { TestBed } from '@angular/core/testing';

import { PopulateDBService } from './populate-db.service';

describe('PopulateDBService', () => {
  let service: PopulateDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopulateDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
