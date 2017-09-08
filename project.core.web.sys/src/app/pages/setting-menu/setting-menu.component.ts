import { Component, OnInit } from '@angular/core';
import { SettingMenuService } from "app/services/setting-menu/setting-menu.service";
import { HtmlDomTemplate } from "app/models/HtmlDomTemplate";
import { ConvertUtil } from './../../common/convert-util';

@Component({
  selector: 'app-setting-menu',
  templateUrl: './setting-menu.component.html',
  styleUrls: ['./setting-menu.component.scss']
})
export class SettingMenuComponent implements OnInit {

  menus = [];//菜单列表
  modalDOMS: HtmlDomTemplate;

  menuBindData;//添加菜单需要提交的数据

  clickId;

  constructor(private settingMenuService: SettingMenuService, private util: ConvertUtil) { }

  ngOnInit() {
    this.getMenuLists();
    this.getMenuModel();
  }

  /**
   * 获取菜单列表
   */
  getMenuLists() {
    this.settingMenuService.getMenuList().subscribe(r => {
      if (r.data) {
        this.menus = r.data;
      }
    })
  }
  /**
   * 获取添加和修改的模版
   */
  getMenuModel() {
    this.settingMenuService.getMenuModel().subscribe(r => {
      if (r.code == "0") {
        this.modalDOMS = r.data.doms;
        this.menuBindData = this.util.toJSON(r.data.bindDataJson);
      }
    })
  }

  /**
   * 添加权限
   */
  addAuthority() { }

  /**
   * 添加页面
   */
  addPage(id) {
    this.clickId = id;
  }

  /**
   * 确定添加页面
   */
  addNewPage($event) {
    let data = this.menuBindData;
    for (let key in $event) {
      data[key] = $event[key];
    }
    data.parentId = this.clickId;
    console.log('提交的数据：', data);
    this.settingMenuService.addMenuPage(data).subscribe(r => {
      console.log(r);
    })
  }
}
