import {Pipe, PipeTransform} from "@angular/core";

/**
 * 带点的返回最后一个字段 数据
 */

@Pipe({
  name: "lastdot"
})
export class LastdotPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let key = value.split(".").pop();
    if (args && args[key]) {
      return args[key];
    } else {
      return key;
    }
  }

}
