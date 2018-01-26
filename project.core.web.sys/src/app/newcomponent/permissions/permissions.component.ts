import { Component, OnInit, Input } from '@angular/core';
import { PermissionsService } from 'app/services/permissions/permissions.service';

@Component({
  selector: 'free-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  providers: [PermissionsService]
})
export class PermissionsComponent implements OnInit {

  @Input() menus: Array<any> = [];//接收的数据
  @Input() id: string;
  @Input() from: string;

  

  codes: Array<string> = [];//选择的code字符串数组

  constructor(private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.codes = [];
  }


  //赋予权限，并添加字体图标
  changeStyle(item) {
    item.active = !item.active
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
  //传递数据
  onSubmit() {
    this.permissionsService.setPermissions(this.id,this.from,this.codes).subscribe(res=>{
      console.log(res)
    })
  }
}
