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
  public allProperties = new BehaviorSubject<Property[]>([]);

  constructor(private scraperApiService: ScraperApiService) {}

  public fetchProperties(): Observable<Property[]> {
    return this.scraperApiService.getScrapes().pipe(
        tap(properties => {
          this.allProperties.next(properties);
          console.log(properties.length + ' properties fetched');
        }),
    );
  }

}
