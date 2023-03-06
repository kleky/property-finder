import { Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class GeocoderService {

  private key = environment.geocoderKey;

  constructor(private httpClient: HttpClient) { }

  get(address: string): Observable<GeocodeResponse> {
    const url =
          "https://maps.googleapis.com/maps/api/geocode/json" +
          `?address=${encodeURIComponent(address)}` +
          `&key=${this.key}`;

    return this.httpClient.get<GeocodeResponse>(url);
  }
}

export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export interface Location {
    lat: number;
    lng: number;
}

export interface Northeast {
    lat: number;
    lng: number;
}

export interface Southwest {
    lat: number;
    lng: number;
}

export interface Viewport {
    northeast: Northeast;
    southwest: Southwest;
}

export interface Geometry {
    location: Location;
    location_type: string;
    viewport: Viewport;
}

export interface GeocodeResult {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: Geometry;
    place_id: string;
    types: string[];
}

export interface GeocodeResponse {
    results: GeocodeResult[];
    status: string;
}
