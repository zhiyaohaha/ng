import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "booleanToWord"
})
export class BooleanToWordPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.indexOf(".") > -1) {
      let arr = value.split(".");
      for (let i = 0; i < arr.length; i++) {
        if (!args[arr[i]]) {
          return "否";
        } else {
          args = args[arr[i]];
          if (typeof args === "boolean") {
              return "是";
          }
        }
      }
    } else {
      return args[value];
    }
  }

}
