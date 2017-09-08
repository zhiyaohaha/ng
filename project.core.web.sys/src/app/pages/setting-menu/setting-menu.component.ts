import { Component, OnInit } from '@angular/core';
import { SettingMenuService } from "app/services/setting-menu/setting-menu.service";
import { HtmlDomTemplate } from "app/models/HtmlDomTemplate";

@Component({
  selector: 'app-setting-menu',
  templateUrl: './setting-menu.component.html',
  styleUrls: ['./setting-menu.component.scss']
})
export class SettingMenuComponent implements OnInit {

  menus = [];//菜单列表
  modalDOMS: HtmlDomTemplate;

  clickId;

  constructor(private settingMenuService: SettingMenuService) { }

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
    console.log($event);
    $event.parentId = this.clickId;
    this.settingMenuService.addMenuPage($event).subscribe(r => {
      console.log(r);
    })
  }
}
