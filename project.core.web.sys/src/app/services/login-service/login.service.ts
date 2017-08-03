import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseService } from './../base.service';
import { Router } from '@angular/router';


@Injectable()
export class LoginService {

  data: any;

  constructor(private service: BaseService, private router: Router) {

  }

  /**
   * 登录
   * @param loginObj 登录传递的参数
   */
  public login(loginObj) {
    let _self = this.router;
    this.service.post("/api/auth/login", loginObj).subscribe(res => {
      if (res.code == 0 || res.message == "已登陆！") {
        _self.navigateByUrl('/main');
      }
    })
  }

}
