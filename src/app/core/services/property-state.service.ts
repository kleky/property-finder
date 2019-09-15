import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ScraperApiService} from './scraper-api.service';
import {tap} from 'rxjs/operators';

export interface Property {
  ref: string;
  url: string;
  imageUrl: string;
  address: string;
  propertyNumber: string;
  propertyType: string;
  postCode: string;
  price: string;
  description: string;
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyStateService {
  private scrapes = new BehaviorSubject<Property[]>(null);

  constructor(private scraperApiService: ScraperApiService) {}

  get watchProperties(): BehaviorSubject<Property[]> {
    return this.scrapes;
  }

  public load(): Observable<Property[]> {
    return this.scraperApiService.getScrapes().pipe(
      tap(p => this.scrapes.next(p))
    );
  }

}
