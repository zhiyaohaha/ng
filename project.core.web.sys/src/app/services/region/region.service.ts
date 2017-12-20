import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class RegionService {

  result: any;

  constructor(private http: Http) { }

  getData() {
    return this.http.get('../../assets/areas.json')
      .map(rsp => rsp.json())
  }

}