import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'strlength'
})

@Injectable()
export class strLength implements PipeTransform {

    transform(items: any, query: string, value: any) {
        if (items.length > 20) {
            return "..." + items.substr(-20);
        } else {
            return items.substr(-20);
        }
    }
}
