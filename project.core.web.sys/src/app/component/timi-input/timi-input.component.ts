import {CommonModule} from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  NgModule,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from "@angular/core";
import {DomRenderer} from "../../common/dom";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export const TIMI_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimiInputComponent),
  multi: true
};

@Component({
  selector: "timi-input",
  template: `
    <div class="box form-item clearfix">
      <div class="box-item item-label"><label>{{labelName}}</label></div>
      <div class="box-item item-control-wrapper">
        <div #wrap class="item-control">
          <input #input class="item-input" type="{{type}}" placeholder="{{placeholder}}" disabled="{{disabled}}"
                 name="{{name}}" value="{{value}}" (blur)="onBlur($event)" spellcheck="false" autocomplete="off"
                 required="{{require}}" (dragover)="allowDrop($event)" (drop)="drop($event)">
          <span class="item-error-tip">{{errorTips}}</span>
        </div>
      </div>
    </div>`,
  styleUrls: ["./timi-input.component.scss"],
  providers: [DomRenderer, TIMI_INPUT_VALUE_ACCESSOR]
})
export class TimiInputComponent implements ControlValueAccessor, AfterViewInit, OnInit {

  @Input()
  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.valueChange(this._value);
  }

  _value;
  @Input() type: string = "text";
  @Input() labelWidth: string;
  @Input() labelName: string;
  @Input() name: string;
  @Input() inputWidth: string;
  @Input() placeholder: string;
  @Input() columns: number;
  @Input() disabled: boolean;
  @Input() require: boolean;
  @Input() pattern: string;
  @Input() errorTips: string;

  @Output() blur: EventEmitter<any> = new EventEmitter();

  @ViewChild("wrap")
  wrapRef: ElementRef;

  @ViewChild("input")
  inputRef: ElementRef;

  private valueChange = (_: any) => { };

  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  /**
   * input失去焦点发射事件
   * @param
   */
  onBlur($event) {
    $event.isChange = this.isChange($event);
    let regexp: any;
    switch (this.pattern) {
      case "tel":
        regexp = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        break;
      case "email":
        regexp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        break;
      case "card":
        regexp = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        break;
      case "chinese":
        // gexp = /[\u4e00-\u9fa5]/gm;
        break;
      case "money":
        regexp = /^(([1-9]\d{0,9})|0)(\.\d{1,4})?$/;
        break;
      case "number":
        regexp = /^\d+$/;
        break;
      case "rate":
        regexp = /^(([1-9]\d{0,2})|0)(\.\d{1,4})?$/;
        break;
      case "password":
        regexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        break;
      default:
        regexp = new RegExp(this.pattern, "i");
    }
    if (!$event.target.value || regexp.test($event.target.value)) {
      this.renderer.removeClass(this.wrapRef.nativeElement, "error");
      this.blur.emit($event);
    } else {
      this.renderer.addClass(this.wrapRef.nativeElement, "error");
    }
  }

  /*允许拖放*/
  allowDrop($event) {
    $event.preventDefault();
  }

  drop($event) {
    const data = $event.dataTransfer.getData("data");
    if (data) {
      this.value = data;
    }
  }


  /**
   * 判断值是否改变
   */
  isChange($event): boolean {
    if (this.value !== $event.target.value) {
      this.value = $event.target.value;
      return true;
    } else {
      return false;
    }
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.valueChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [TimiInputComponent],
  exports: [TimiInputComponent]
})

export class TimiInputModule {
}
