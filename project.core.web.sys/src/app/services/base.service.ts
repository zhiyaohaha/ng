import { Observable } from "rxjs/Rx";
import { CommonModule } from "@angular/common";
import { ConvertUtil } from "./../common/convert-util";
import { Injectable } from "@angular/core";
import { Http, RequestOptionsArgs, RequestOptions, Headers, URLSearchParams } from "@angular/http";
import { environment } from "./../../environments/environment";

import "rxjs/Rx";
import "rxjs/add/operator/map";
import { Router } from "@angular/router";
import { globalUrl } from "../common/global.config";

@Injectable()
export class BaseService {

  protected private_key = globalUrl.private_key;
  private urlPrefix = environment.apiURL;

  constructor(private http: Http, private util: ConvertUtil, private router: Router) { }


  /**
   * POST鉴权
   * @param options 请求参数
   */
  private setAuth<T>(_params: T): any {
    let timestamp = this.util.timestamp();
    let str;
    if (typeof _params !== "string") {
      str = this.util.toJsonStr(_params);
    } else {
      str = _params;
    }
    str = str.replace(/\+/g, "%2B");
    let sign = this.util.toMd5(str + timestamp + this.private_key);
    //let sign = this.util.toMd5(str.replace(/\+/g, " ") + timestamp + this.private_key);
    let params = new URLSearchParams();
    params.set('data', str);
    params.set('sign', sign);
    params.set('timestamp', timestamp);
    console.log(params)
    return params;
  }

  /**
   * GET鉴权
   * @param _params 请求参数
   */
  private setAuthGet<T>(_params: T): string {
    let timestamp = this.util.timestamp();
    let params = this.util.firstLetterSort(_params);
    let sign = _params ? this.util.toMd5(params + timestamp + this.private_key) : this.util.toMd5(timestamp + this.private_key);
    return _params ? params + '&timestamp=' + timestamp + '&sign=' + sign : 'timestamp=' + timestamp + '&sign=' + sign;
  }

  /**
   *            POST方法
   * @param url         请求地址
   * @param params      请求参数
   */
  public post<T>(url: string, params?: object) {
    let options = new RequestOptions({ "withCredentials": true });
    return this.http.post(this.urlPrefix + url, this.setAuth(params), options)
      .map(res => this.extractData(res))
      .filter(r => this.NeedLogin(r))
      .catch(this.handleError);
  }

  /**
   *           GET方法
   * @param url       请求地址
   * @param param     请求参数
   */
  public get<T>(url: string, param?: any) {
    let option = this.setAuthGet(param);
    return this.http.get(this.urlPrefix + url, {
      params: option,
      withCredentials: true
    }).map(res => this.extractData(res))
      .filter(r => this.NeedLogin(r))
      .catch(this.handleError);
  }

  /**
   * 格式化数据
   */
  private extractData(res) {
    let body = res.json();
    return body || {};
  }

  /**
   * 错误handler
   */
  private handleError(error: any) {
    console.log(error)
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : `Server error`;
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  /**
   * 重新登录
   */
  private NeedLogin(r) {
    if (r.code == "NeedLogin") {
      this.router.navigateByUrl("/login");
      return false;
    } else {
      return true;
    }
  }

}

export class HttpParams<T> {
  public data: T;
  public timestamp: string;
  public sign: string;
}
