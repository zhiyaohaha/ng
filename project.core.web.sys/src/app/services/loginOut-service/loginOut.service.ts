import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {BaseService} from "./../base.service";
import {Router} from "@angular/router";
import {UserService} from "../user/user.service";


@Injectable()
export class LoginOutService {

  data: any;

  constructor(private service: BaseService, private router: Router, private userService: UserService) {

  }

  public loginOut() {
    let _self = this.router;
    this.service.post("/api/auth/loginout").subscribe(res => {
      if (res.code === 0) {
        this.userService.isLogin = false;
        _self.navigateByUrl("/login");
      } else {
        console.log(res);
      }
    })
  }

}
