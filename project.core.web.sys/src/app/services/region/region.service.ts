import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { BaseService } from "../base.service";

@Injectable()
export class RegionService {

  result: any;

  constructor(private http: Http, private baseService: BaseService) { }

  getData() {
    return this.http.get('../../assets/areas.json')
      .map(rsp => rsp.json())
  }

  //获取第二级和第三级地区的数据
  getThridAreaSelect(id) {
    return this.baseService.get("/api/Area/GetThridAreaSelect", {
      parentCode: id
    });
  }

  //根据最后一级id，获取相关联的上下级id 
  getFullThridArea() {
    return this.http.get('../../assets/threeAreas.json')
      .map(rsp => rsp.json())
  }

}