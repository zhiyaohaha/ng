import {Injectable, Output, EventEmitter} from "@angular/core";

@Injectable()
export class ToastService {

  messages: any[] = [];
  @Output()
  onChanges: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  creatNewMessage(data) {
    this.messages.push({
      content: data.message
    });
    data.message = this.messages;
    this.onChanges.emit(data);
  }

}
