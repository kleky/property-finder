import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Geolocation, GeolocationPosition} from "@capacitor/core";
import {Property, PropertyStateService} from "../core/services/property-state.service";
import {switchMap, take, withLatestFrom} from "rxjs/operators";
import {BehaviorSubject, of, Subscription} from "rxjs";
import {AgmInfoWindow, AgmMap, LatLngBounds} from "@agm/core";

function boundsContainsCoordinates(lat: number, lng: number, bounds: LatLngBounds): boolean {
    if (!lat || !lng || !bounds) {
        return false;
    }
    // @ts-ignore
    return bounds.contains(new google.maps.LatLng(lat, lng, true));
}

export interface ILatLng {
    lat: number;
    lng: number;
}

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"],
})
export class HomePage implements OnDestroy, OnInit {
    mapCentre: ILatLng = {lat: 56.4745215, lng: -3.1069149};
    userPosition: ILatLng = {lat: 56.4745215, lng: -3.1069149};
    propertiesInBounds = new BehaviorSubject<Property[]>([]);
    bounds = new BehaviorSubject<LatLngBounds>(null);
    infoWindowImageUrl = "";
    watchMe = false;
    trackMe = true;
    infoWindows: AgmInfoWindow[] = [];

    private locationWatcher = "";
    private subscriptions: Subscription[] = [];

    @ViewChild("map", {static: true}) map: AgmMap;
    @ViewChild("searchBox", {static: true}) searchBox: any;

    constructor(private propertyStateService: PropertyStateService) {
        this.getCurrentPosition().then(geo => {
            this.setMapCentre(geo.coords.latitude, geo.coords.longitude);
        }).catch(e => console.error("Error setting map centre upon construct", e));
    }

    ngOnInit(): void {
        this.trackLocation(false);
    }

    mapReady(event: any) {
        this.map = event;
        const input = document.getElementById("mapSearch");
        // @ts-ignore
        this.searchBox = new google.maps.places.SearchBox(input);
        // @ts-ignore
        this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(document.getElementById("watchButton"));
        // @ts-ignore
        this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(document.getElementById("trackButton"));
        // @ts-ignore
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById("mapSearch"));
        this.searchBox.addListener("places_changed", () => this.goToSearchedPlace());
        this.setupProperties();
    }

    goToSearchedPlace() {
        const places = this.searchBox.getPlaces();
        if (places.length === 0) {
            return;
        }
        // @ts-ignore
        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        // @ts-ignore
        this.map.fitBounds(bounds);
    }

    boundsChange(bounds: LatLngBounds) {
        of(bounds).pipe(
            take(1),
            withLatestFrom(this.propertyStateService.allProperties),
            switchMap(([b, properties]) => of(properties.filter(p => boundsContainsCoordinates(p.lat, p.lng, b)))),
        ).subscribe(properties => {
            this.propertiesInBounds.next(properties);
        }, error => console.error("Failed in watchProperties", error));
    }

    private setupProperties() {
        this.subscriptions.push(
            this.propertyStateService.fetchProperties().pipe(
                withLatestFrom(this.bounds),
                switchMap(([properties, bounds]) => of(properties.filter(p => boundsContainsCoordinates(p.lat, p.lng, bounds)))),
            ).subscribe(properties => {
                this.propertiesInBounds.next(properties);
            }, error => console.error("Failed in watchProperties", error))
        );
    }

    watchLocation(stop: boolean): void {
        if (stop && !this.trackMe) {
            this.watchMe = false;
            this.unwatchLocation(this.locationWatcher);
        } else if (this.locationWatcher !== "") {
            this.watchMe = !stop;
        } else {
            console.log("Watch and starting watcher");
            this.watchMe = true;
            this.locationWatcher = Geolocation.watchPosition({
                enableHighAccuracy: true,
                timeout: 7000,
                maximumAge: 6000,
                requireAltitude: false,
            }, (position, err) =>
                this.updateWatchLocation(position, err, this.trackMe, this.watchMe));
        }
        console.log("Watching", this.watchMe);
    }

    trackLocation(stop: boolean): void {
        if (stop && !this.watchMe) {
            this.trackMe = false;
            this.unwatchLocation(this.locationWatcher);
        } else if (this.locationWatcher !== "") {
            this.trackMe = !stop;
        } else {
            console.log("Tracking and starting watcher");
            this.trackMe = true;
            this.locationWatcher = Geolocation.watchPosition({
                enableHighAccuracy: true,
                timeout: 7000,
                maximumAge: 6000,
                requireAltitude: false,
            }, (position, err) =>
                this.updateWatchLocation(position, err, this.trackMe, this.watchMe));
        }
        console.log("Tracking", this.trackMe);
    }


    markerClick(infoWindow: AgmInfoWindow, imageUrl: string) {
        this.closeOpenInfoWindows();
        this.infoWindowImageUrl = imageUrl;
        this.infoWindows.push(infoWindow);
    }

    closeOpenInfoWindows() {
        this.infoWindows.forEach(infoWindow => {
            if (infoWindow) {
                try {
                    infoWindow.close();
                } catch (e) {
                }
            }
        });
    }

    private updateWatchLocation(position: GeolocationPosition,
                                err: any, tracking: boolean,
                                watching: boolean) {
        if (err) {
            console.error("Error updating position", err);
        } else {
            if (tracking) {
                this.setUserPosition(position.coords.latitude, position.coords.longitude);
            }
            if (watching) {
                this.setMapCentre(position.coords.latitude, position.coords.longitude);
            }
        }
    }

    private async unwatchLocation(id: string): Promise<boolean> {
        return Geolocation.clearWatch({id})
            .then(_ => this.locationWatcher = "")
            .then(_ => console.log("Unwatched location"))
            .then(_ => true);
    }

    private async getCurrentPosition(): Promise<GeolocationPosition> {
        return Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 7000,
            maximumAge: 6000,
            requireAltitude: false,
        });
    }

    private setMapCentre(lat: number, lng: number): void {
        this.mapCentre.lat = lat;
        this.mapCentre.lng = lng;
    }

    private setUserPosition(lat: number, lng: number): void {
        this.userPosition.lat = lat;
        this.userPosition.lng = lng;
    }

    ngOnDestroy(): void {
        if (this.locationWatcher) {
            this.unwatchLocation(this.locationWatcher);
        }
        this.subscriptions.forEach(s => {
            console.log(`destroying ${s}`);
            s.unsubscribe();
        });
    }

    getPropertyUrl(property: Property): string {
        return property.imageUrl.indexOf("tsps") > -1
            ? "https://www.tspc.co.uk" + property.url // tspc was the first and only type without the domain included
            : property.url;
    }
}
