import { BaseService } from './../base.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SettingMenuService {

    constructor(private baseService: BaseService) { }

    getMenuList() {
        return this.baseService.get("/api/Menu/list");
    }

}