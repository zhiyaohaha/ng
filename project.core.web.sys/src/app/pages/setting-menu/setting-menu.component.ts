import { Component, OnInit } from '@angular/core';
import { SettingMenuService } from "app/services/setting-menu/setting-menu.service";

@Component({
  selector: 'app-setting-menu',
  templateUrl: './setting-menu.component.html',
  styleUrls: ['./setting-menu.component.scss']
})
export class SettingMenuComponent implements OnInit {

  menus = [
    [{ name: "页面一", functions: ["浏览", "编辑"] },
    { name: "页面二", functions: ["浏览", "编辑"] },
    { name: "页面三", functions: ["浏览", "编辑", "修改"] }],
    [{ name: "页面一", functions: ["浏览", "编辑"] },
    { name: "页面二", functions: ["浏览", "编辑"] },
    { name: "页面三", functions: ["浏览", "编辑", "修改"] }]
  ];

  constructor(private getMenuListsService: SettingMenuService) { }

  ngOnInit() {
    this.getMenuLists();
  }

  /**
   * 获取菜单列表
   */
  getMenuLists() {
    this.getMenuListsService.getMenuList().subscribe(r => {
      if (r.data) {
        this.menus = r.data;
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
  addPage() { }
}
