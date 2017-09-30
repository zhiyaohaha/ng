import { CommonModule } from "@angular/common";
import {
  NgModule, Component, OnInit, AfterViewInit, OnDestroy,
  Input, ViewChild, ElementRef, Renderer2, EventEmitter, Output, forwardRef
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

const TIMI_CHIP_GROUP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimiChipGroupComponent),
  multi: true
}

@Component({
  selector: "timi-chip-group",
  template: `
    <div class="timi-chip-group" [ngClass]="chipClass">
      <timi-chip *ngFor="let chip of value;let i = index;" [value]="chip" (click)="delChip(i)"></timi-chip>
      <input spellcheck="false" type="text" *ngIf="placeholder" [placeholder]="placeholder"
             (focus)="onFocus()" (blur)="onFocus()" (keyup.enter)="onEnter($event)" (dragover)="allowDrop($event)" (drop)="drop($event)">
    </div>
  `,
  styleUrls: ["./chip.component.scss"],
  providers: [TIMI_CHIP_GROUP_VALUE_ACCESSOR]
})

export class TimiChipGroupComponent implements ControlValueAccessor, OnInit {

  @Input()
  set chips(value: any) {
    this.value = [];
    for (const v of value) {
      const isExited = this.value.find((elem, index, array) => {
        return elem === v;
      });
      if (!isExited) {
        this.value.push(v);
      }
    }
    this._propagateChange(this.chips)
  }

  get chips(): any {
    return this.value;
  }

  @Output() chipsChange: EventEmitter<any> = new EventEmitter();
  @Input() placeholder: string;
  chipClass = {};
  focus: boolean;
  groups: TimiChipComponent[] = [];
  value: any[] = [];

  private _propagateChange = (_: any) => {
  };
  constructor() {}

  ngOnInit() {
    this.setChipClass();
  }

  setChipClass() {
    this.chipClass = {
      "timi-chip-input": this.placeholder,
      "timi-chip-focus": this.focus
    };
  }

  addGroup(value: TimiChipComponent) {
    this.groups.push(value);
  }

  removeGroup(value: TimiChipComponent) {
    const index = this.value.findIndex((elem, i, array) => {
      return elem.value === value.value;
    });
    if (index !== -1) {
      this.groups.splice(index, 1);
      this.value.splice(index, 1);
      this.chipsChange.emit(this.chips);
      this._propagateChange(this.chips);
    }
  }

  onFocus() {
    this.focus = !this.focus;
    this.setChipClass();
  }

  onEnter(event: any) {
    const value = event.target.value.trim();
    if (value) {
      this.chips.push(value);
      this.chips = this.chips.slice();
      event.target.value = "";
    }
    this.chipsChange.emit(this.chips);
    this._propagateChange(this.chips);
  }

  allowDrop($event) {
    $event.preventDefault();
  }

  drop($event) {
    const data = $event.dataTransfer.getData("data");
    this.chips.push(data);
    this.chips = this.chips.slice();
    this.chipsChange.emit(this.chips);
  }

  delChip(index) {
    this.value.splice(index, 1);
  }

  writeValue(value: any) {
    if (value) {
      this.chips = value;
    }
  }
  registerOnChange(fn) {
    this._propagateChange = fn;
  }
  registerOnTouched() {}
}

@Component({
  selector: "timi-chip",
  template: `
    <div #container class="timi-chip" tabindex="0">{{value}}</div>
  `
})
export class TimiChipComponent implements OnInit, AfterViewInit, OnDestroy {

  protected group: TimiChipGroupComponent;
  @Input() value: any;
  @Input() delete: boolean;
  @ViewChild("container") container: ElementRef;
  constructor(private renderer2: Renderer2,
    group: TimiChipGroupComponent) {
    this.group = group;
  }

  ngOnInit() {
    if (this.group) {
      this.group.addGroup(this);
    }
  }

  ngAfterViewInit() {
    if (this.delete) {
      this.renderer2.addClass(this.container.nativeElement, "timi-chip-delete");
    } else {
      this.renderer2.removeClass(this.container.nativeElement, "timi-chip-delete");
    }
  }

  onDelete() {
    if (this.group) {
      this.group.removeGroup(this);
    }
  }

  ngOnDestroy() {
    if (this.group) {
      this.value = "";
      // this.group.removeGroup(this);
    }
  }

}

@NgModule({
  imports: [CommonModule],
  declarations: [TimiChipComponent, TimiChipGroupComponent],
  exports: [TimiChipComponent, TimiChipGroupComponent]
})

export class TimiChipModule { }

