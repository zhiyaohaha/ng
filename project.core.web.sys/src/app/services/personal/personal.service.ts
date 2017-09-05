import { BaseService } from './../base.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PersonalService {

    constructor(private _baseSerive: BaseService) { }

    /**
     * 获取个人信息
     */
    public getPersonalInfo() {
        return this._baseSerive.get("/api/Loginer/GetPersonalBasicInfo");
    }

    /**
     * 设置头像
     * @param params 头像的url
     */
    public setPersonalHeader(params) {
        return this._baseSerive.post("/api/Loginer/ChangeAvatar", params);
    }

    /**
     * 修改个人信息
     * @param params { "key":"字段名称", "value":"字段值" }
     */
    public setPersonalInfo(params) {
        return this._baseSerive.post("/api/Loginer/UpdatePersonalBasicInfo", params);
    }

}