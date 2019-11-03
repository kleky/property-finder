import { Injectable } from "@angular/core";
import {Property} from "../../core/services/property-state.service";
import * as moment from "moment";

@Injectable()
export class PropertyMapperService {

  public mapProperties(data: any): Property[] {
    const items = JSON.parse(data.Body.toString("utf-8")) as Property[];
    items.forEach(i => {
      i.iconUrl = this.getHouseIconUrl(i);
    });
    return items;
  }

  private getHouseIconUrl(property: Property): string {
    const oneDayAgo = moment().subtract(1, "days");
    const oneWeekAgo = moment().subtract(1, "weeks");
    const oneMonthAgo = moment().subtract(1, "months");
    const dateAdded = moment(property.dateAdded, "YYYY-MM-DD HH:MM");

    if (dateAdded.isSameOrAfter(oneDayAgo, "day")) {
      return "../../assets/icon/home-1day.svg";
    }

    if (dateAdded.isSameOrAfter(oneWeekAgo, "day")) {
      return "../../assets/icon/home-1week.svg";
    }

    if (dateAdded.isSameOrAfter(oneMonthAgo, "day")) {
      return "../../assets/icon/home-1month.svg";
    }
    return "../../assets/icon/home.svg";
  }

}
