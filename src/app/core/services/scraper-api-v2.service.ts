import {Injectable} from "@angular/core";
import {Property} from "./property-state.service";
import * as S3 from "aws-sdk/clients/s3";
import {fromPromise} from "rxjs/internal-compatibility";
import {map, shareReplay, tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {PropertyMapperService} from "../../shared/mappers/property-mapper.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ScraperApiService {

    BUCKET = "scrapes-tspc";
    KEY = "tspc.json";

    private scrapesCache: Observable<Property[]>;

    constructor(private propertyMapper: PropertyMapperService) {}

	getScrapes(): Observable<Property[]> {
        if (!this.scrapesCache) {
            this.scrapesCache = this.scrapesApi().pipe(shareReplay(1));
        }
        return this.scrapesCache;
    }

    private scrapesApi(): Observable<Property[]> {
        return fromPromise(this.getS3Bucket().getObject({
            Bucket: this.BUCKET,
            Key: this.KEY,
        }).promise()).pipe(
            map(data => this.propertyMapper.mapProperties(data)),
            tap(t => console.log("Scrapes from API", t.length))
        );
    }


    private getS3Bucket(): S3 {
        return new S3(
            {
                accessKeyId: `${environment.awsAccessKeyId}`,
                secretAccessKey: `${environment.awsSecretAccessKey}`,
                region: "us-east-1",
            }
        );
    }
}
