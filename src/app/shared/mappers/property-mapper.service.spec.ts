import { TestBed } from '@angular/core/testing';

import { PropertyMapperService } from './property-mapper.service';

describe('PropertyMapperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PropertyMapperService = TestBed.get(PropertyMapperService);
    expect(service).toBeTruthy();
  });
});
