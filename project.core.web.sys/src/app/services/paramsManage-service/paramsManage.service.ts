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

    /**
     * 修改参数
     */
    public saveParams(param) {
        return this.service.post("/api/Customized/Update", param);
    }

    /**
     * 添加参数
     */
    public addParams(param) {
        return this.service.post("/api/Customized/Add", param);
    }

    /**
     * 获取修改参数模版
     */
    public editParamsModal(param) {
        return this.service.get("/api/Customized/GetConfig", param);
    }

    /**
     * 获取修改参数模版的详细数据
     */
    public getEditParams(param) {
        return this.service.get("/api/Customized/Detail", param);
    }

}
