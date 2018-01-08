import {fadeIn} from "./../../common/animations";
import {Component, OnInit, Renderer2} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {TdDialogService} from "@covalent/core";
import {ToastService} from "./../../component/toast/toast.service";
import {SettingMenuService} from "app/services/setting-menu/setting-menu.service";
import {HtmlDomTemplate} from "app/models/HtmlDomTemplate";
import {ConvertUtil} from "./../../common/convert-util";
import {FnUtil} from "./../../common/fn-util";

@Component({
  selector: "app-setting-menu",
  templateUrl: "./setting-menu.component.html",
  styleUrls: ["./setting-menu.component.scss"],
  animations: [fadeIn]
})
export class SettingMenuComponent implements OnInit {

  authorities: string[]; //权限

  sidenavActive: boolean;

  menus = []; //菜单列表
  modelDOMS: HtmlDomTemplate; //响应式表单的模版
  modelMenu: HtmlDomTemplate; //菜单模板
  modelAuthority: HtmlDomTemplate; //权限模板

  label: string; //添加或者修改的tab

  menuBindData; //菜单提交数据模板
  authorityBindData; //权限提交数据模板

  modelBindData; //提交的数据模板

  modelDOMSData; //当前修改项的原数据

  addId; //当前激活的添加ID
  updateId; //当前激活的修改ID
  targetModel; //当前激活的模板
  addOrUpdate: boolean; //添加false 修改true
  menuOrAuthority; //菜单或权限

  constructor(private settingMenuService: SettingMenuService,
              private util: ConvertUtil,
              private toastService: ToastService,
              private routerInfor: ActivatedRoute,
              private fnUtil: FnUtil,
              private renderer2: Renderer2,
              private dialogService: TdDialogService) {
    this.authorities = this.fnUtil.getFunctions();
  }

  ngOnInit() {
    this.getMenuLists();
  }

  /**
   * 添加
   */
  add(parentId, target) {
    this.label = "添加";
    this.addOrUpdate = false;
    this.addId = parentId;
    this.getTargetModel(target);
    this.modelDOMSData = "";
  }

  /**
   * 修改
   */
  update(id, parentId, target) {
    this.label = "修改";
    this.addOrUpdate = true;
    this.updateId = id;
    this.addId = parentId;
    this.getTargetModel(target, id);
    this.modelDOMSData = this.searchItem(id);
  }

  /**
   * 当前需要显示的模板
   */
  getTargetModel(target, id?: number) {
    this.menuOrAuthority = target;
    let param = id ? {id: id} : "";
    if (target === "menu") {
      //菜单模板
      this.settingMenuService.getMenuModel(param).subscribe(res => {
        if (res.code === "0") {
          this.modelDOMS = res.data.doms;
          this.modelBindData = res.data.bindData;
        }
      });
    } else if (target === "authority") {
      //权限模板
      this.settingMenuService.getAuthorityModel(param).subscribe(res => {
        if (res.code === "0") {
          console.log(res);
          this.modelDOMS = res.data.doms;
          this.modelBindData = res.data.bindData;
        }
      });
    }
  }


  /**
   * 获取菜单列表
   */
  getMenuLists() {
    this.settingMenuService.getMenuList().subscribe(r => {
      if (r.data) {
        this.menus = r.data;
      }
    });
  }

  /**
   * 添加权限
   */
  addNewAuthority() {
  }


  /**
   * 确定添加页面或者权限
   */
  addNew($event) {
    let data = this.modelBindData;
    for (let key in $event) {
      if ($event[key]) {
        data[key] = $event[key];
      }
    }
    if (this.menuOrAuthority === "menu") {
      data.parentId = this.addId;
      this.settingMenuService.addMenuPage(data).subscribe(r => this.cb(r)); //添加页面
    } else if (this.menuOrAuthority === "authority") {
      data.menu = this.addId;
      this.settingMenuService.addAuthority(data).subscribe(r => this.cb(r)); //添加权限
    }

  }


  /**
   * 确定修改菜单或者权限
   */
  updateOld($event) {
    let data = this.searchItem($event.id);
    for (let key in $event) {
      if ($event[key]) {
        data[key] = $event[key];
      }
    }
    data.parentId = this.addId;
    if (this.menuOrAuthority === "menu") {
      this.settingMenuService.updateMenu(data).subscribe(r => this.cb(r)); //添加页面
    } else if (this.menuOrAuthority === "authority") {
      this.settingMenuService.updateAuthority(data).subscribe(r => this.cb(r)); //添加权限
    }
  }

  /**
   * 接口回调
   */
  cb(data) {
    this.toastService.creatNewMessage(data.message);
    if (data.code === "0") {
      this.getMenuLists();
    }
  }

  /**
   * 确定修改或者添加
   */
  confirm($event) {
    if (!this.addOrUpdate) {
      this.addNew($event);
    } else {
      this.updateOld($event);
    }
  }

  /**
   * 确定删除权限或者页面
   */
  deleteAuthority($event, id) {
    $event.stopPropagation();
    this.dialogService.openConfirm({
      message: `确定删除该权限吗？删除后不可恢复`,
      title: "警告",
      cancelButton: "取消",
      acceptButton: "确定"
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.settingMenuService.deleteAuthorty(id).subscribe(r => {
          this.toastService.creatNewMessage(r.message);
          if (r.code == "0") {
            this.renderer2.setStyle($event.target.parentNode, "display", "none");
          }
        });
      }
    });
  }

  deletePage($event, id, index) {
    $event.stopPropagation();
    this.dialogService.openConfirm({
      message: `确定删除该页面吗？删除后不可恢复`,
      title: "警告",
      cancelButton: "取消",
      acceptButton: "确定"
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.settingMenuService.deletePage(id).subscribe(r => {
          this.toastService.creatNewMessage(r.message);
          if (r.code === "0") {
            if (index === 0) {
              this.renderer2.setStyle($event.target.parentNode.parentNode.parentNode, "display", "none");
            } else {
              this.renderer2.setStyle($event.target.parentNode.parentNode, "display", "none");
            }
          }
        });
      }
    });
  }


  /**
   * 删除警告
   */
  deleteAlert(type: string): boolean {
    let bool: boolean;
    this.dialogService.openConfirm({
      message: `确定删除改${type}吗？删除后不可恢复`,
      title: "警告",
      cancelButton: "取消",
      acceptButton: "确定"
    }).afterClosed().subscribe((accept: boolean) => {
      bool = accept;
    });
    return bool;
  }

  /**
   * 根据ID查找对象
   */
  searchItem(id) {
    let data;
    this.menus.filter(r => {
      r.filter(item => {
        if (item.id === id) {
          data = item;
        }
        if (item._functions) {
          return item._functions.filter(i => {
            if (i.id === id) {
              data = i;
            }
          });
        }
      });
    });
    return data;
  }

  /**
   * 侧边栏关闭
   */
  onSidenavClose() {
    this.sidenavActive = false;
  }

  onSidenavOpen() {
    this.sidenavActive = true;
  }

}
