import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "strToArray"
})
export class StrToArrayPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (Array.isArray(value)) {
      return value;
    } else {
      return value.split(",");
    }
  }

}
