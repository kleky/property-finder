import { TestBed } from '@angular/core/testing';

import { ScraperApiService } from './scraper-api.service';

describe('ScraperApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScraperApiService = TestBed.get(ScraperApiService);
    expect(service).toBeTruthy();
  });
});
