import {CommonModule} from "@angular/common";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Component, EventEmitter, forwardRef, Input, NgModule, OnInit, Output} from "@angular/core";
import {MdCheckboxModule, MdSelectModule} from "@angular/material";
import {TimiInputModule} from "../../component/timi-input/timi-input.component";

const CUSTOM_FORM_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TableUiComponent),
  multi: true
};

@Component({
  selector: "table-ui",
  template: `
    <div class="form-group">
      <timi-input labelName="标题" name="label" (blur)="changes($event, 'label')"></timi-input>
    </div>
    <div class="form-group">
      <timi-input labelName="占位符" name="placeholder" (blur)="changes($event, 'placeholder')"></timi-input>
    </div>
    <div class="form-group position-group">
      <md-select placeholder="展示类型" name="displayType"  (change)="changes($event, 'displayType')">
        <md-option *ngFor="let item of displayTypesOptions" [value]="item.value">
          {{item.text}}
        </md-option>
      </md-select>
    </div>
    <div class="form-group position-group">
      <md-checkbox color="primary" name="hidden" (change)="changes($event, 'hidden')">隐藏</md-checkbox>
    </div>
  `,
  styleUrls: [],
  providers: [CUSTOM_FORM_CONTROL_VALUE_ACCESSOR]
})

export class TableUiComponent implements ControlValueAccessor, OnInit {

  @Input()
  set testData(value) {
    this.value = value;
  }
  get testData() {
    return this.value;
  }

  @Input() displayTypesOptions;

  private value: UiModel = {label: "", placeholder: "", displayType: "", hidden: false};
  private _propagateChange = (_: any) => { };

  changes($event, key) {
    if (key === "label" || key === "placeholder") {
      this.value[key] = $event.target.value;
    }
    if (key === "hidden") {
      this.value[key] = $event.checked;
    }
    this._propagateChange(this.testData);
  }

  writeValue(obj: any): void {
    if (obj) {
      this.testData = obj;
    }
  }

  registerOnChange(fn: any): void {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  ngOnInit(): void {
  }

}

export class UiModel {
  label: string; // 标题
  placeholder: string; // 占位符
  displayType: string; // 展示类型
  hidden: boolean; // 隐藏
}

@NgModule({
  imports: [CommonModule, TimiInputModule, MdSelectModule, MdCheckboxModule],
  declarations: [TableUiComponent],
  exports: [TableUiComponent]
})
export class TableUiModule {
}
