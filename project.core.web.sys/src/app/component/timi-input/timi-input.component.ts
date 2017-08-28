import { CommonModule } from '@angular/common';
import { NgModule, Component, OnInit, Input, Renderer2, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { DomRenderer } from '../../common/dom';

@Component({
    selector: 'timi-input',
    template: `<label #label>{{labelName}}：</label>
                <div #wrap class="timi-input-wrap">
                    <input #input type="{{type}}" class="timi-input" placeholder="{{placeholder}}" disabled="{{disabled}}" value="{{value}}" (blur)="onBlur($event)" spellcheck="false" autocomplete="off">
                    <span class="timi-span-line"></span>
                    <span class="timi-input-error">{{errorTips}}</span>
                </div>`,
    styleUrls: ['./timi-input.component.scss'],
    providers: [DomRenderer]
})
export class TimiInputComponent implements OnInit {

    @Input() type: string = "text";
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
                regexp = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                break;
            case 'email':
                regexp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                break;
            case 'card':
                regexp = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                break;
            case 'chinese':
                //regexp = /^[\u4e00-\u9fa5]+$/;
                regexp = /[\u4e00-\u9fa5]/gm;
                break;
            case 'money':
                regexp = /^(([1-9]\d{0,9})|0)(\.\d{1,4})?$/;
                break;
            case 'number':
                regexp = /^\d+$/;
                break;
            case 'rate':
                regexp = /^(([1-9]\d{0,2})|0)(\.\d{1,4})?$/;
                break;
            case 'password':
                regexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
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

export class TimiInputModule { }