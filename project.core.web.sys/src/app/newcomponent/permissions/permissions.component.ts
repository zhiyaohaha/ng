import {Component, OnInit, Input} from "@angular/core";
import {PermissionsService} from "../../services/permissions/permissions.service";

@Component({
  selector: "free-permissions",
  templateUrl: "./permissions.component.html",
  styleUrls: ["./permissions.component.scss"],
  providers: [PermissionsService]
})
export class PermissionsComponent implements OnInit {

  @Input() menus: Array<any> = []; //接收的数据
  @Input() id: string;
  @Input() from: string;


  codes: Array<string> = []; //选择的code字符串数组

  constructor(private permissionsService: PermissionsService) {
  }

  ngOnInit() {
    this.getMenus(this.id, this.from);
  }

  /**
   * 获取权限数
   * @param id 点击的ID
   * @param from 从哪个页面获取该数据
   */
  getMenus(id, from) {
    this.permissionsService.getPermissions(id)
      .subscribe(res => {
        this.menus = res.data;
      });
  }

  //全选
  multipleCheck(page, menu) {
    if (page.depth === 0) {
      page.active = !page.active;
      if (page.active === true) {
        for (let i = 0; i < menu.length; i++) {
          if (menu[i]._functions.length > 0) {
            for (let j = 0; j < menu[i]._functions.length; j++) {
              if (!(this.inArray(menu[i]._functions[j].code, this.codes))) {
                this.codes.push(menu[i]._functions[j].code);
                menu[i]._functions[j].active = true;
              }
            }
          }
        }
      } else if (page.active === false) {
        for (let i = 0; i < menu.length; i++) {
          for (let j = 0; j < menu[i]._functions.length; j++) {
            this.removeByValue(this.codes, menu[i]._functions[j].code);
            menu[i]._functions[j].active = false;
          }
        }
      }
      console.log("每个page第一个数据");
    } else if (page.depth === 1) {
      page.active = !page.active;
      if (page.active === true && page._functions.length > 0) {
        for (let i = 0; i < page._functions.length; i++) {
          if (!(this.inArray(page._functions[i].code, this.codes))) {
            this.codes.push(page._functions[i].code);
            page._functions[i].active = true;
          }
        }
      } else if (page.active === false) {
        for (let i = 0; i < page._functions.length; i++) {
          this.removeByValue(this.codes, page._functions[i].code);
          page._functions[i].active = false;
        }
      }
      console.log("每个page第二个之后数据");
    }
  }

  //赋予权限，并添加字体图标
  changeStyle(page, item) {
    item.active = !item.active;
    if (item.active === true) {
      this.codes.push(item.code);
    } else if (item.active === false) {
      this.removeByValue(this.codes, item.code);
    }
  }

  //删除数组中的特定值
  removeByValue(arr, value) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        arr.splice(i, 1);
        break;
      }
    }
  }

  //判断元素是否在数组中
  inArray(search, array) {
    for (let i in array) {
      if (array[i] === search) {
        return true;
      }
    }
    return false;
  }

  //传递数据
  onSubmit() {
    this.permissionsService.setPermissions(this.id, this.codes).subscribe(res => {
      console.log(res);
    });
  }
}
