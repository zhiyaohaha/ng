import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseService } from './../base.service';
import { Router } from '@angular/router';


@Injectable()
export class LoginService {

  data: any;

  constructor(private service: BaseService) {

  }

  /**
   * 登录
   * @param loginObj 登录传递的参数
   */
  public login(loginObj) {
    return this.service.post("/api/auth/login", loginObj);
  }

}
