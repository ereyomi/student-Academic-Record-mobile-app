import { TestBed } from '@angular/core/testing';

import { SelectOptionResolverService } from './select-option-resolver.service';

describe('SelectOptionResolverService', () => {
  let service: SelectOptionResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectOptionResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
