import {CommonModule} from "@angular/common";
import {AfterViewInit, Component, forwardRef, Input, NgModule, OnInit, Renderer2,ElementRef} from "@angular/core";
import {DomRenderer} from "../../common/dom";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export const TIMI_TEXTAREA_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimiTextareaComponent),
  multi: true
};

@Component({
  selector: "timi-textarea",
  template: `<div class="box form-item">
    <div class="box-item item-label"><label>{{labelName}}</label></div>
    <div class="box-item item-control-wrapper">
      <div class="item-control">
        <textarea class="item-textarea" placeholder="{{placeholder}}" disabled="{{disabled}}"
               name="{{name}}" spellcheck="false" autocomplete="off" (blur)="blur($event)"
                  required="{{require}}">{{value}}</textarea>
        <span class="item-error-tip">{{errorTips}}</span>
      </div>
    </div>
  </div>`,
  styleUrls: ["./timi-textarea.component.scss"],
  providers: [DomRenderer, TIMI_TEXTAREA_VALUE_ACCESSOR]
})
export class TimiTextareaComponent implements ControlValueAccessor, AfterViewInit, OnInit {

  @Input()
  get value() {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
    this.valueChange(this._value);
  }
  _value;

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

  private valueChange = (_: any) => { };

  constructor(private renderer: Renderer2,private er:ElementRef) {
  }

  ngOnInit() {
      this.er.nativeElement.classList.add("ng-pristine-custom");  //为了解决，此组件初始化状态下是‘ng-dirty’。而不是‘ng-pristine’
  }

  blur($event) {  
    $event.path[4].className =  $event.path[4].className.replace("ng-pristine-custom ","")   //为了解决，此组件初始化状态下是‘ng-dirty’。而不是‘ng-pristine’
    this.value = $event.target.value;
  }

  writeValue(obj: any): void {
    this.value = obj || "";
  }

  registerOnChange(fn: any): void {
    this.valueChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  ngAfterViewInit(): void {
  }

}

@NgModule({
  imports: [CommonModule],
  declarations: [TimiTextareaComponent],
  exports: [TimiTextareaComponent]
})

export class TimiTextareaModule {
}
