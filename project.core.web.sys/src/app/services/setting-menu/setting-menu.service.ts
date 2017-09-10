import { BaseService } from './../base.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SettingMenuService {

    constructor(private baseService: BaseService) { }

    /**
     * 获取菜单列表
     */
    getMenuList() {
        return this.baseService.get("/api/Menu/list");
    }

    /**
     * 修改添加页面的模版
     */
    getMenuModel() {
        return this.baseService.get("/api/Template/GetFormTemplat/SysMenuData");
    }

    /**
     * 添加页面
     */
    addMenuPage(param) {
        return this.baseService.post("/api/Template/Add/SysMenuData", param);
    }

    /**
     * 修改页面
     */
    updateMenu(param) {
        return this.baseService.post("/api/Template/Update/SysMenuData", param);
    }



    /**
     * 添加权限的模板
     */
    getAuthorityModel() {
        return this.baseService.get("/api/Template/GetFormTemplat/SysFunctionData");
    }
    /**
     * 添加权限
     */
    addAuthority(param) {
        return this.baseService.post("/api/Template/Add/SysFunctionData", param);
    }
    /**
     * 修改权限
     */
    updateAuthority(param) {
        return this.baseService.post("/api/Template/Update/SysFunctionData", param);
    }

}