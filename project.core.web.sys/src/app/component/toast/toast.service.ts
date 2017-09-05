import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class ToastService {

    messages: any[] = [];
    @Output()
    onChanges: EventEmitter<any> = new EventEmitter();

    constructor() { }

    creatNewMessage(msg) {
        this.messages.push({
            content: msg
        })
        this.onChanges.emit(this.messages);
    }

}