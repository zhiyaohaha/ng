import { ToastService } from './toast.service';
import { CommonModule } from '@angular/common';
import { NgModule, Component, Input, EventEmitter, Output, OnInit, IterableDiffers, DoCheck, ViewEncapsulation } from '@angular/core';
import { style, trigger, state, animate, transition } from '@angular/animations';
import { DomRenderer } from '../../common/dom';

@Component({
    selector: 'app-toast',
    template: `
    <div class="app-toast" [style.zIndex]="zIndex">
      <div class="app-toast-item app-{{message.theme || theme}}"
           *ngFor="let message of messages;index as i"
           [@moveInState]="'in'" (@moveInState.done)="onMoveInDone(message, i)">
        <div class="app-notification-avatar" *ngIf="theme || message.icon">
          <i class="fa fa-{{setIcon(theme || message.icon)}}"></i>
        </div>
        <div class="app-toast-item-content">
          <div class="app-toast-message">{{message.content}}</div>
        </div>
      </div>
    </div>
  `,
    styleUrls: ["./toast.component.scss"],
    animations: [
        trigger('moveInState', [
            state('in', style({
                opacity: 1,
                transform: 'translate3d(0, 0, 0)'
            })),
            transition(':enter', [
                style({
                    opacity: 0,
                    transform: 'translate3d(0, -100%, 0)'
                }),
                animate('.25s cubic-bezier(.25,.8,.25,1)')
            ]),
            transition(':leave', animate('.1s', style({
                opacity: 0,
                transform: 'translate3d(0, -100%, 0)'
            })))
        ])
    ],
    providers: [DomRenderer]
})
export class ToastComponent implements DoCheck, OnInit {
    @Input() get messages(): any[] {
        return this._messages;
    }
    set messages(value: any[]) {
        if (value) {
            this._messages = value;
            const length = this._messages.length;
            if (length > 10) {
                this._messages = this._messages.slice(length - 10);
            }
        }
    }
    @Input() delay: number;
    @Input() maxMessage: number;
    @Input() theme: string;
    @Output() onClose: EventEmitter<any> = new EventEmitter();
    icon: string;
    _messages: any[];
    zIndex: number;
    differ: any;
    constructor(public domRenderer: DomRenderer, public differs: IterableDiffers, private toastService: ToastService) {
        this.messages = [];
        this.maxMessage = 10;
        this.delay = 5000;
        this.theme = 'default';
        this.differ = differs.find([]).create(null);
    }

    ngOnInit() {
        this.toastService.onChanges.subscribe(d => {
            this.messages = d;
        })
    }

    ngDoCheck() {
        const changes = this.differ.diff(this.messages);
        if (changes) {
            this.zIndex = ++DomRenderer.zIndex;
        }
    }

    remove(item: any, index: number) {
        this._messages.splice(index, 1);
        this.onClose.emit({
            message: item,
            index: index
        });
    }

    onMoveInDone(item: any, index: number) {
        if (this.delay) {
            setTimeout((msg) => {
                this._messages.forEach((m, i) => {
                    if (msg === m) {
                        this.remove(m, i);
                    }
                })
            }, item.delay || this.delay, item);
        }
    }

    setIcon(value: string) {
        switch (value) {
            case 'danger': this.icon = 'times-circle'; break;
            case 'info': this.icon = 'info-circle'; break;
            case 'warning': this.icon = 'exclamation-circle'; break;
            case 'success': this.icon = 'check-circle'; break;
        }
        return this.icon;
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [ToastComponent],
    exports: [ToastComponent]
})

export class ToastModule { }