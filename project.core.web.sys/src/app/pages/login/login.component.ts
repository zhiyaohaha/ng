import { URLSearchParams, Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/Rx';

import { LoginService } from '../../services/login-service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      account: ["administrator", Validators.required],
      password: ["1", Validators.required]
    })
  }

  onLogin() {
    let loginInfo = { "Account": this.loginForm.value.account, "Password": this.loginForm.value.password };
    this.loginService.login(loginInfo);
  }

}
