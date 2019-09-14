import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ScraperApiService} from './scraper-api.service';
import {tap} from 'rxjs/operators';

export interface Property {
  ref: string;
  url: string;
  address: string;
  propertyNumber: string;
  propertyType: string;
  postCode: string;
  price: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyStateService {
  private scrapes = new BehaviorSubject<Property[]>(null);

  constructor(private scraperApiService: ScraperApiService) {}

  public load(): Observable<Property[]> {
    return this.scraperApiService.getScrapes().pipe(
      tap(p => this.scrapes.next(p))
    );
  }

}
