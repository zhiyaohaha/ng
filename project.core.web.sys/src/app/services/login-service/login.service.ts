import { Injectable } from "@angular/core";
import { BaseService } from "./../base.service";

@Injectable()
export class LoginService {

  data;


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
