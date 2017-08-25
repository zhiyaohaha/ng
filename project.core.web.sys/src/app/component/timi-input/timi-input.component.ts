import { CommonModule } from '@angular/common';
import { NgModule, Component, OnInit, Input, Renderer2, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { DomRenderer } from '../../common/dom';

@Component({
    selector: 'timi-input',
    template: `<label #label>{{labelName}}：</label>
                <div #wrap class="timi-input-wrap">
                    <input #input type="text" class="timi-input" placeholder="{{placeholder}}" disabled="{{disabled}}" value="{{value}}" (blur)="onBlur($event)" spellcheck="false">
                    <span class="timi-span-line"></span>
                    <span class="timi-input-error">{{errorTips}}</span>
                </div>`,
    styleUrls: ['./timi-input.component.scss'],
    providers: [DomRenderer]
})
export class TimiInputComponent implements OnInit {

    @Input() labelWidth: string;
    @Input() labelName: string;
    @Input() value: string;
    @Input() inputWidth: string;
    @Input() placeholder: string;
    @Input() disabled: boolean;
    @Input() pattern: string;
    @Input() errorTips: string;

    @Output() blur: EventEmitter<any> = new EventEmitter();

    @ViewChild('wrap')
    wrapRef: ElementRef;

    @ViewChild('label')
    labelRef: ElementRef;

    @ViewChild('input')
    inputRef: ElementRef;

    constructor(private renderer: Renderer2) { }
    ngOnInit() { }

    ngAfterViewInit() {
        this.renderer.setStyle(this.labelRef.nativeElement, "width", this.labelWidth);
        this.renderer.setStyle(this.inputRef.nativeElement, "width", this.inputWidth);
    }

    /**
     * input失去焦点发射事件
     * @param  
     */
    onBlur($event) {
        let regexp: any;
        switch (this.pattern) {
            case 'tel':
                regexp = /1[3,5,8]\d{9}/;
                break;
            case 'email':
                regexp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                break;
            case 'card':
                regexp = /^\d{15}|\d{18}$/;
                break;
            case 'chinese':
                regexp = /^[\u4e00-\u9fa5]+$/;
                break;
            default:
                regexp = new RegExp(this.pattern, 'i');
        }
        if (regexp.test($event.target.value)) {
            this.renderer.removeClass(this.wrapRef.nativeElement, "error");
            this.blur.emit($event);
        } else {
            this.renderer.addClass(this.wrapRef.nativeElement, "error");
        }
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [TimiInputComponent],
    exports: [TimiInputComponent]
})

export class TimiModule { }