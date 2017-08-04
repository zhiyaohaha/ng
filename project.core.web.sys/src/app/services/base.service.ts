import { CommonModule } from '@angular/common';
import { ConvertUtil } from './../common/convert-util';
import { JsonResult } from './models/jsonResult';
import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, RequestOptions, Headers } from '@angular/http';

import 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable()
export class BaseService {

  private private_key = "84qudMIhOkX5JMQXVd0f4jneqfP2Lp";
  private urlPrefix = "http://api.cpf360.com";

  constructor(private http: Http, private util: ConvertUtil, private router: Router) { }


  /**
   * POST鉴权
   * @param options 请求参数
   */
  public setAuth<T>(_params: T): HttpParams<T> {
    let params = new HttpParams<T>();
    params.data = _params;
    params.timestamp = this.util.timestamp();
    params.sign = this.util.toMd5(this.util.toJsonStr(params.data) + params.timestamp + this.private_key);
    return params;
  }

  /**
   * GET鉴权
   * @param _params 请求参数
   */
  public setAuthGet<T>(_params: T): string {
    let timestamp = this.util.timestamp();
    let sign = _params ? this.util.toMd5(_params + timestamp + this.private_key) : this.util.toMd5(timestamp + this.private_key);
    return _params ? _params + '&timestamp=' + timestamp + '&sign=' + sign : 'timestamp=' + timestamp + '&sign=' + sign;
  }

  /**
   *            POST方法
   * @param url         请求地址
   * @param params      请求参数
   */
  public post<T>(url: string, params?: object) {
    let options = new RequestOptions({ "withCredentials": true });
    let callback = this.http.post(this.urlPrefix + url, this.setAuth(params), options).map(res => res.json());
    return callback;
  }

  /**
   *           GET方法
   * @param url       请求地址
   * @param param     请求参数
   */
  public get<T>(url: string, param?: string) {
    let option = this.setAuthGet(param);
    let callback = this.http.get(this.urlPrefix + url, {
      params: option,
      withCredentials: true
    }).map(res => res.json()).filter(r => {
      if (r.code == "NeedLogin") {
        this.NeedLogin();
        return false;
      } else {
        return true;
      }
    });
    return callback;
  }

  private NeedLogin() {
    this.router.navigateByUrl("/login");
  }

}

export class HttpParams<T> {
  public data: T;
  public timestamp: string;
  public sign: string;
}