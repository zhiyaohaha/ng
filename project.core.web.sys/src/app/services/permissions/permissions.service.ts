import { Injectable } from '@angular/core';
import { BaseService } from 'app/services/base.service';

@Injectable()
export class PermissionsService {

  constructor(private baseService: BaseService) { }

  //展示权限数据
  getPermissions(id, from) {
    return this.baseService.get("/api/Function/GetByFrom", { "id": id, "from": from });
  }
  //设置权限
  setPermissions(id, from, codes) {
    return this.baseService.post("/api/Function/SetByFrom", { "id": id, "from": from, "codes": codes })
  }
}
