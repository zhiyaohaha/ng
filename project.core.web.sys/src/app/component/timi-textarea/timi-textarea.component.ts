import {CommonModule} from "@angular/common";
import {
  NgModule,
  Component,
  OnInit,
  Input,
  Renderer2,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild, forwardRef, AfterViewInit
} from "@angular/core";
import {DomRenderer} from "../../common/dom";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export const TIMI_TEXTAREA_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimiTextareaComponent),
  multi: true
}

@Component({
  selector: "timi-textarea",
  template: `<div class="box form-item">
    <div class="box-item item-label label{{columns}}"><label>{{labelName}}</label></div>
    <div class="box-item item-control-wrapper wrapper{{columns}}">
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

  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {
  }

  blur($event) {
    this.value = $event.target.value;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
    }
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
