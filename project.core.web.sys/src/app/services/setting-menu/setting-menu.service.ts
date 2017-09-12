import { Injectable } from '@angular/core';
import { FnUtil } from './../../common/fn-util';
import { BaseService } from './../base.service';

@Injectable()
export class SettingMenuService {

    constructor(private baseService: BaseService, private fnUtil: FnUtil, ) { }

    /**
     * 获取菜单列表
     */
    getMenuList() {
        return this.baseService.get(this.fnUtil.searchAPI("SystemSetting.MenuSetting.ViewMenu"));
    }

    /**
     * 修改添加页面的模版
     */
    getMenuModel() {
        return this.baseService.get(this.fnUtil.searchAPI("SystemSetting.MenuSetting.MenuFormTemplate"));
    }

    /**
     * 添加页面
     */
    addMenuPage(param) {
        return this.baseService.post(this.fnUtil.searchAPI("SystemSetting.MenuSetting.AddMenu"), param);
    }

    /**
     * 修改页面
     */
    updateMenu(param) {
        return this.baseService.post(this.fnUtil.searchAPI("SystemSetting.MenuSetting.UpdateMenu"), param);
    }



    /**
     * 添加权限的模板
     */
    getAuthorityModel() {
        return this.baseService.get(this.fnUtil.searchAPI("SystemSetting.MenuSetting.FunctionFormTemplate"));
    }
    /**
     * 添加权限
     */
    addAuthority(param) {
        return this.baseService.post(this.fnUtil.searchAPI("SystemSetting.MenuSetting.AddFunction"), param);
    }
    /**
     * 修改权限
     */
    updateAuthority(param) {
        return this.baseService.post(this.fnUtil.searchAPI("SystemSetting.MenuSetting.UpdateFunction"), param);
    }

}