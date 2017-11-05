import { Injectable } from "@angular/core";
import { BaseService } from "./../base.service";
import { FnUtil } from "./../../common/fn-util";

@Injectable()
export class PersonalService {

    constructor(private _baseSerive: BaseService, private fnUtil: FnUtil) { }

    /**
     * 获取个人信息
     */
    public getPersonalInfo() {
        return this._baseSerive.get(this.fnUtil.searchAPI("PersonalCenter.BasicInfo.View"));
    }

    /**
     * 设置头像
     * @param params 头像的url
     */
    public setPersonalHeader(params) {
        return this._baseSerive.post(this.fnUtil.searchAPI("PersonalCenter.BasicInfo.UpdateAvatar"), params);
    }

    /**
     * 修改个人信息
     * @param params { "key":"字段名称", "value":"字段值" }
     */
    public setPersonalInfo(params) {
        return this._baseSerive.post(this.fnUtil.searchAPI("PersonalCenter.BasicInfo.Update"), params);
    }

}
