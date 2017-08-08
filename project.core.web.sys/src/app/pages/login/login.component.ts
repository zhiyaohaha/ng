import { URLSearchParams, Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/Rx';

import { LoginService } from '../../services/login-service/login.service';
import { userNameValidator } from '../../validators/validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  msgErrors: string;
  errors: boolean;
  logining: boolean;

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      account: ["administrator", [Validators.required]],
      password: ["1", Validators.required]
    })
  }

  onLogin() {
    let account = this.loginForm.value.account;
    let password = this.loginForm.value.password;
    this.errors = true;
    if (this.loginForm.valid) {
      this.logining = true;
      let loginInfo = { "account": account, "password": password };
      this.loginService.login(loginInfo).subscribe(res => {
        if (res.code == "0") {
          this.router.navigateByUrl('/main');
        } else {
          this.logining = false;
          this.msgErrors = res.message;
        }
      })
    }
  }

}
