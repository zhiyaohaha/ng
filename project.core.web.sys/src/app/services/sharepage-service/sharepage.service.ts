import { BaseService } from './../base.service';
import { Injectable } from '@angular/core';
import { FnUtil } from './../../common/fn-util';

@Injectable()
export class SharepageService {

    constructor(private service: BaseService, private fnUtil: FnUtil) { }

    /**
     * 获取参数管理的列表
     */
    public getParams(param) {
        return this.service.get(this.fnUtil.searchAPI("SystemSetting.OperationLogRecord.View"), param);
    }

    /**
     * 获取修改参数模版
     */
    public editParamsModal() {
        return this.service.get(this.fnUtil.searchAPI("FunctionType.FormTemplate", "type"));
    }

    /**
     * 获取修改参数模版的详细数据
     */
    public getEditParams(param) {
        return this.service.get(this.fnUtil.searchAPI("SystemSetting.OperationLogRecord.View"), param);
    }

}