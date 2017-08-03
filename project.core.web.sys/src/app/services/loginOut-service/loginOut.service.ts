import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseService } from './../base.service';
import { Router } from '@angular/router';


@Injectable()
export class LoginOutService {

    data: any;

    constructor(private service: BaseService, private router: Router) {

    }

    public loginOut() {
        let _self = this.router;
        this.service.post("/api/auth/loginout").subscribe(res => {
            if (res.code == 0) {
                _self.navigateByUrl('/login');
            } else {
                console.log(res);
            }
        })
    }

}
