import {CommonModule} from "@angular/common";
import {NgModule, Component, OnInit, Input, EventEmitter, Output, forwardRef} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {CheckboxModule} from "../checkbox/checkbox.component";

const TIMI_CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimiCheckboxComponent),
  multi: true
}

@Component({
  selector: "timi-checkbox",
  template: `
    <div class="box form-item">
      <div *ngIf="multiple" class="box-item item-label label{{columns}}"><label>{{labelName}}</label></div>
      <div *ngIf="multiple" class="box-item item-control-wrapper wrapper{{columns}}">
        <div #wrap class="item-control">
          <ng-container *ngFor="let item of checkboxs">
            <free-checkbox [value]="item.value" [label]="item.text" (onChange)="onChange($event)"
                           [checked]="checked && checked.indexOf(item.value) > -1"></free-checkbox>
          </ng-container>          
        </div>
      </div>
      <div *ngIf="!multiple" class="box-item item-control-wrapper wrapper{{columns}}" style="margin-left: 30%;">
        <div #wrap class="item-control">
          <free-checkbox [label]="checkboxs" [checked]="checked" (onChange)="onChange($event)"></free-checkbox>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./timi-checkbox.component.scss"],
  providers: [TIMI_CHECKBOX_VALUE_ACCESSOR]
})

export class TimiCheckboxComponent implements ControlValueAccessor, OnInit {

  @Input() checkboxs: any;
  @Input() columns: string;
  @Input() labelName: string;
  @Input() multiple: boolean;

  checked;
  outPutArr = [];

  private valueChange = (_: any) => {
  }

  constructor() {
  }

  ngOnInit() {

  }

  onChange($event) {
    if (this.multiple) {
      if ($event.checked) {
        this.outPutArr.push($event.value);
      } else {
        this.outPutArr.splice(this.outPutArr.indexOf($event.value), 1);
      }
      this.valueChange(this.outPutArr);
    } else {
      this.valueChange($event.checked);
    }
  }

  writeValue(value: any) {
    this.checked = value;
    this.outPutArr = value;
  }

  registerOnChange(fn) {
    this.valueChange = fn;
  }

  registerOnTouched() {
  }
}

@NgModule({
  imports: [CommonModule, CheckboxModule],
  declarations: [TimiCheckboxComponent],
  exports: [TimiCheckboxComponent]
})

export class TimiCheckboxModule {
}

