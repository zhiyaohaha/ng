import {Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import "rxjs/Rx";

import {LoginService} from "../../services/login-service/login.service";
import {CommunicationService} from "./../../services/share/communication.service";
import {defaultValue} from "../../common/global.config";
import {LoginOutService} from "../../services/loginOut-service/loginOut.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [LoginService, LoginOutService]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  msgErrors: string;
  errors: boolean;
  logining: boolean;
  private pageApi = {};

  constructor(private fb: FormBuilder,
              private router: Router,
              private loginService: LoginService,
              private loginOutService: LoginOutService,
              private myService: CommunicationService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      account: ["administrator", [Validators.required]],
      password: ["#Cmd@NoPassword", Validators.required]
    });

    if (sessionStorage.getItem("load") === "yes") {
      this.loginOutService.loginOut();
      sessionStorage.clear();
    }
  }

  /**
   * 登录
   */
  onLogin() {
    let account = this.loginForm.value.account;
    let password = this.loginForm.value.password;
    this.errors = true;
    if (this.loginForm.valid) {
      this.logining = true;
      let loginInfo = {"account": account, "password": password};
      this.loginService.login(loginInfo).subscribe(res => {
        if (res.code === "0") {
          if (res.data && res.data.menus) {
            localStorage.setItem("menus", JSON.stringify(res.data.menus));
            localStorage.setItem("avatar", res.data._avatar || defaultValue.defaultAvatar);
            this.writeMenus(res.data.menus);
            sessionStorage.setItem("load", "yes");
          }
          this.router.navigateByUrl("/main");
        } else {
          this.logining = false;
          this.msgErrors = res.message;
        }
      });
    }
  }


  /**
   * 提取页面API写入到localstorage
   */
  private writeMenus(menus) {
    menus.forEach(element => {
      this.pageApi[element.code] = {a: element.functions, u: element._functions};
      if (element.childrens) {
        this.writeMenus(element.childrens);
      }
    });
    localStorage.setItem("pa", JSON.stringify(this.pageApi));
  }

}
