import { TestBed } from '@angular/core/testing';

import { PropertyStateService } from './property-state.service';

describe('ScrapesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PropertyStateService = TestBed.get(PropertyStateService);
    expect(service).toBeTruthy();
  });
});
