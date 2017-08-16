import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseService } from './../base.service';
import { Router } from '@angular/router';


@Injectable()
export class ParamsManageService {

    data: any;

    constructor(private service: BaseService, private router: Router) {

    }

    /**
     * 获取参数管理的列表
     */
    public getParams(param) {
        return this.service.get("/api/Customized/List", param);
    }

    public saveParams(param) {
        return this.service.get("/api/Customized/Detail", param);
    }

}
