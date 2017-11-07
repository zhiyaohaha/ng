import {ActivatedRoute} from "@angular/router";
import {Injectable} from "@angular/core";
import {ConvertUtil} from "./convert-util";

@Injectable()
export class FnUtil {

  private menus = this.convertUtil.toJSON(localStorage.getItem("menus"));

  constructor(private convertUtil: ConvertUtil,
              private routerInfo: ActivatedRoute) {
  }

  /**
   * 获取当前页面权限
   */
  public getFunctions() {
    let pageCode = this.routerInfo.snapshot.queryParams["pageCode"];
    return this.convertUtil.toJSON(localStorage.getItem("pa"))[pageCode].a;
  }

  /**
   * 获取当前页面的api接口
   * @param key 公共页面的区别key
   * @param param code 默认获取code字段，其他情况有type
   */
  public searchAPI(key: string, param?: string) {
    let apis;
    let pageCode = this.routerInfo.snapshot.queryParams["pageCode"];
    this.menus.filter(r => {
      r.childrens.filter(cc => {
        if (cc.code === pageCode) {
          apis = cc;
        }
      })[0];
    })
    let api = apis._functions.filter(r => {
      if (param) {
        return r[param] === key;
      } else {
        return r.code === key;
      }
    })[0];
    return "/api" + api.url;
  }

  /**
   * 判断数组里面是否存在某一项字符串
   * @param array 数组
   * @param str 包含的字符串
   */
  public arrayIsInclude(array: string[], str: string): boolean {
    let bool = array.map(r => r == str);
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
   * 根据pipe格式化表格数据
   */
  public formatTableCell (data: any[]): any[] {
    data.map( item => {
      switch (item.pipe) {
        case "HtmlPipe.Date": item.format = v => this.convertUtil.getFullDateTime(v);
          break;
      }
    })
    return data;
  }


}


