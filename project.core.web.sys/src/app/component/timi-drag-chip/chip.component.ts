import {CommonModule} from "@angular/common";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Component, EventEmitter, forwardRef, Input, NgModule, OnInit, Output} from "@angular/core";

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimiDragChipComponent),
  multi: true
};

@Component({
  selector: "timi-drag-chip",
  template: `
    <div class="timi-chip">
      <ul>
        <li *ngFor="let chip of chips;let i = index;" (click)="delChip(i)">{{chip}}</li>
      </ul>
      <div (drop)="onDrop($event)" (dragover)="allowDrop($event)">拖拽添加</div>
    </div>
  `,
  styleUrls: ["./chip.component.scss"],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})

export class TimiDragChipComponent implements ControlValueAccessor, OnInit {

  @Input()
  set chips(value: any) {
    this.value = [];
    if (typeof value === "string") {
      this.value.push(value);
    } else {
      for (const v of value) {
        const isExited = this.value.find((elem, index, array) => {
          return elem === v;
        });
        if (!isExited) {
          this.value.push(v);
        }
      }
    }
    this._propagateChange(this.value);
  }

  get chips(): any {
    return this.value;
  }

  @Input() length: number;

  @Output() chipsChange: EventEmitter<any> = new EventEmitter();


  value: any[] = [];
  private _value: any;
  private _propagateChange = (_: any) => { };

  constructor() {
  }

  ngOnInit() {
  }

  delChip(index) {
    this.value.splice(index, 1);
  }

  onDrop($event) {
    const data = $event.dataTransfer.getData("data");
    if (data) {
      if (this.length && this.value.length >= this.length) {
        this.value.shift();
      }
      this.value.push(data);
      this.chipsChange.emit(this.chips);
      this._propagateChange(this.chips);
    }
  }

  allowDrop($event) {
    $event.preventDefault();
  }

  writeValue(value: any) {
    if (value) {
      this.chips = value;
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
  }

}

@NgModule({
  imports: [CommonModule],
  declarations: [TimiDragChipComponent],
  exports: [TimiDragChipComponent]
})
export class TimiDragChipModule {
}
