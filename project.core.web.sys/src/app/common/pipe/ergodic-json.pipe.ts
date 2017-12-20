/**
 * 通过传递带点的字符串和原JSON数据，获取json下面嵌套的值
 * 原JSON var json = {a:{b:{c:1}}};
 * "a.b.c" | ergodicJson : json
 * 返回 1
 */

import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "ergodicJson"
})
export class ErgodicJsonPipe implements PipeTransform {

  /**
   * @param value 传入的带“.”字符串
   * @param args 传入的JSON源
   * @returns {any} 返回值
   */
  transform(value: any, args?: any): any {
    if (value.indexOf(".") > 0) {
      let arr = value.split(".");
      for (let i = 0; i < arr.length; i++) {
        // if (typeof args[arr[i]] === "undefined")
        if (!args[arr[i]]) {  //可能是null和 undefined 
            if (typeof args[arr[i]] === "undefined"){
              continue;
            }else{  //null
              return "";
            }
        }
        args = args[arr[i]];
        if (Array.isArray(args)) {
          // let temp = [];
          // args.forEach((element) => {
          //   temp.push(element[arr[i + 1]]);
          // });
          // return temp;
          return args.join(",");
        } else if (typeof args === "string" || typeof args === "number") {
          return args;
        }
      }
      return args;
    }
    return args[value];
  }

}
