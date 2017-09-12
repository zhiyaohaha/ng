import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { ConvertUtil } from './convert-util';

@Injectable()
export class FnUtil {

    private menus = this.convertUtil.toJSON(localStorage.getItem("menus"));

    constructor(
        private convertUtil: ConvertUtil,
        private routerInfo: ActivatedRoute
    ) { }


    /**
     * 获取当前页面权限
     */
    public getFunctions() {
        let functions;
        let apis
        let pageCode = this.routerInfo.snapshot.queryParams["pageCode"];
        this.menus.filter(r => {
            apis = r.childrens.filter(cc => cc.code == pageCode)[0];
        })
        return apis.functions;
    }

    /**
     * 获取当前页面的api接口
     * @param key 公共页面的区别key
     * @param param code 默认获取code字段，其他情况有type
     */
    public searchAPI(key: string, param?: string) {
        let apis;
        let pageCode = this.routerInfo.snapshot.queryParams["pageCode"];
        this.menus.filter(r => {
            apis = r.childrens.filter(cc => cc.code == pageCode)[0];
        })
        let api = apis._functions.filter(r => {
            if (param) {
                return r[param] == key
            } else {
                return r.code == key
            }
        })[0];
        return "/api" + api.url;
    }

    public arrayIsInclude(array: string[], str: string): boolean {
        let bool = array.map(r => r == str);
        if (bool) {
            return true;
        } else {
            return false;
        }
    }


}