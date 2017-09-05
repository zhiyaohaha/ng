import { BaseService } from './../base.service';
import { Injectable } from '@angular/core';

@Injectable()
export class OnepageService {

    constructor(private service: BaseService) { }

    /**
     * 获取参数管理的列表
     */
    public getParams(param) {
        return this.service.get("/api/Customized/List", param);
    }

    /**
     * 获取修改参数模版的详细数据
     */
    public getEditParams(param) {
        return this.service.get("/api/Customized/Detail", param);
    }

}