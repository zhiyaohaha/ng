import {ActivatedRoute} from "@angular/router";
import {Injectable} from "@angular/core";
import {ConvertUtil} from "./convert-util";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class FnUtil {

  private menus;

  private _subject: Subject<any> = new Subject<any>();

  constructor(private convertUtil: ConvertUtil,
              private routerInfo: ActivatedRoute) {
  }

  /**
   * 获取页面页码配置
   */
  public getPaginationInfo(): any {
    let pageCode = this.getPageCode();
    let data = {
      pageSize: 10,
      currentPage: 0
    };
    if (!localStorage.getItem(pageCode + "ps")) {
      localStorage.setItem(pageCode + "ps", "10");
      localStorage.setItem(pageCode + "cp", "0");
    } else {
      data.pageSize = parseInt(localStorage.getItem(pageCode + "ps"), 10);
      data.currentPage = parseInt(localStorage.getItem(pageCode + "cp"), 10);
    }
    return data;
  }

  /**
   * 获取当前页面权限
   */
  public getFunctions() {
    let pageCode = this.getPageCode();
    return this.convertUtil.toJSON(localStorage.getItem("pa"))[pageCode].a;
  }

  /**
   * 获取当前页面的api接口
   * @param key 公共页面的区别key
   * @param param code 默认获取code字段，其他情况有type
   */
  public searchAPI(key: string, param: string = "code") {
    let apis;
    let pageCode = this.getPageCode();
    this.menus = this.convertUtil.toJSON(localStorage.getItem("menus")); //用户菜单
    this.menus.filter(r => {
      r.childrens.filter(cc => {
        if (cc.code === pageCode) {
          apis = cc;
        }
      })[0];
    });
    let api = apis._functions.filter(r => {
      return r[param] === key;
    })[0];
    return api ? "/api" + api.url : "";
  }

  /**
   * 判断数组里面是否存在某一项字符串
   * @param array 数组
   * @param str 包含的字符串
   */
  public arrayIsInclude(array: string[], str: string): boolean {
    let bool = array.map(r => r === str);
    if (bool) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 获取URL里面对应的查询参数
   */
  public queryUrlParam(url: string) {
    if (!url) {
      return false;
    }
    let urlArry = url.split("?")[1].split("&");
    let urlObj: object;
    urlArry.forEach((value, index, arr) => {
      let temp = value.split("=");
      urlObj[temp[0]] = temp[1];
    });
    return urlObj;
  }

  /**
   * 获取JSON长度
   */
  public getJSONLength(json) {
    let length = 0;
    for (let key in json) {
      length++;
    }
    return length;
  }

  /**
   * 订阅空对象
   */
  public setSubject(arg: any): void {
    this._subject.next(arg);
  }

  public getSubject(): Observable<any> {
    return this._subject.asObservable();
  }

  /**
   * @param value 传入的带“.”字符串
   * @param args 传入的JSON源
   * @returns {any} 返回值
   */
  getJSONData(value: any, args?: any): any {
    if (value.indexOf(".") > 0) {
      let arr = value.split(".");
      for (let i = 0; i < arr.length; i++) {
        if (!args[arr[i]]) {
          return "";
        }
        args = args[arr[i]];
        if (Array.isArray(args)) {
          let temp = [];
          args.forEach((element) => {
            temp.push(element[arr[i + 1]]);
          });
          return temp;
        }
      }
      return args;
    }
    return args[value];
  }

  /**
   * 获取页面代码
   */
  public getPageCode(): string {
    return this.routerInfo.snapshot.queryParams["pageCode"];
  }

}


