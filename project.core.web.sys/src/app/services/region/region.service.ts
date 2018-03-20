import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { BaseService } from "../base.service";

@Injectable()
export class RegionService {

  result: any;

  constructor(private http: Http, private baseService: BaseService) { }

  getData(json_name) {
    return this.http.get('../../assets/' + json_name + '.json')
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