import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from './../base.service';
import { FnUtil } from './../../common/fn-util';

@Injectable()
export class SharepageService {

    constructor(private service: BaseService, private fnUtil: FnUtil, private routerInfo: ActivatedRoute) { }

    /**
     * 获取参数管理的列表
     */
    public getParams(param) {
        return this.service.get(this.fnUtil.searchAPI(this.routerInfo.snapshot.queryParams["pageCode"] + ".View"), param);
    }

    /**
     * 获取修改参数模版
     */
    public editParamsModal() {
        return this.service.get(this.fnUtil.searchAPI(this.routerInfo.snapshot.queryParams["pageCode"] + ".FormTemplate", "type"));
    }

    /**
     * 获取修改参数模版的详细数据
     */
    public getEditParams(param) {
        return this.service.get(this.fnUtil.searchAPI(this.routerInfo.snapshot.queryParams["pageCode"] + ".View"), param);
    }

}