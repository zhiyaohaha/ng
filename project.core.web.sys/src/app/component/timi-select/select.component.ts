import {CommonModule} from "@angular/common";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CheckboxModule} from "../checkbox/checkbox.component";
import {ObjectUtils} from "../../common/util";

const CUSTOM_SELECT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimiSelectComponent),
  multi: true
};

@Component({
  selector: "timi-select",
  template: `
    <div class="select-wrap">
      <span class="free-select-name label{{columns}}" *ngIf="freeSelectName">{{freeSelectName}}</span>
      <div class="free-select wrap{{columns}}" [ngClass]="{'free-select-click-active':freeClickActive}"
           (click)="onClick()">
        <div class="free-select-input">
          <label>{{value || pholder}}</label>
        </div>
        <div class="free-select-menu" *ngIf="opened" [@selectState]="'in'" (click)="onMenuClick()">
          <div class="free-select-filter" *ngIf="filter">
            <free-checkbox *ngIf="multiple" [checked]="multipleTotal" (onChange)="onMultipleTotal($event)">
            </free-checkbox>
            <div class="free-select-inner">
              <i class="fa fa-search"></i>
              <input type="text" [(ngModel)]="_filterValue" (input)="onFilterChange($event)">
            </div>
          </div>
          <div class="free-select-wrapper free-iscroll">
            <ul *ngIf="!multiple">
              <free-select-item
                *ngFor="let option of filterValue(options, 'text'); index as i"
                (onClick)="onItemClick($event)" [option]="option"></free-select-item>
            </ul>
            <ul *ngIf="multiple">
              <li *ngFor="let option of filterValue(options, 'text')" (click)="clickLi($event)">
                <free-checkbox (onChange)="onCheckboxSelect($event, option)" [checked]="option.checked"
                               [label]="option.text" [value]="option.value"></free-checkbox>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger("selectState", [
      state("in", style({
        opacity: 1,
        transform: "translate3d(0, 0, 0)"
      })),
      transition(":enter", [
        style({
          opacity: 0,
          transform: "translate3d(0, 80px, 0)"
        }), animate(".4s cubic-bezier(.25,.8,.25,1)")
      ]),
      transition(":leave", animate(".1s", style({
        opacity: 0
      })))
    ])
  ],
  styleUrls: ["select.component.scss"],
  providers: [CUSTOM_SELECT_CONTROL_VALUE_ACCESSOR, ObjectUtils]
})
export class TimiSelectComponent implements ControlValueAccessor, OnInit, AfterContentInit, OnDestroy {
  @Input() pholder: string;
  @Input() multipleTotal: boolean; //多选中的全选
  @Input() editable: boolean;
  @Input() filter: boolean;
  @Input() selected: any;
  @Input() multiple: boolean;
  @Input() freeSelectName: string;
  @Input() columns: string;
  @ViewChild("input") input: ElementRef;
  opened: boolean;
  _filterValue: any;
  value: string;
  itemClick: boolean;
  items: TimiSelectItemComponent[] = [];
  selfClick: boolean;
  freeClickActive: boolean;
  bindDocumentClickListener: Function;
  onModelChange: Function = () => {
  };
  onTouchedChange: Function = () => {
  };

  constructor(public renderer2: Renderer2, public objUtil: ObjectUtils) {
    this.onDocumentClickListener();
  }

  _options: any;

  @Input()
  get options(): any {
    return this._options;
  }

  set options(value: any) {
    if (!value) {
      return;
    }
    this._options = value;
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    if (this.selected && !this.multiple) {
      let selected = this.options.filter(r => r.value === this.selected)[0];
      this.value = selected.text;
    }
  }

  writeValue(value: any) {
    this.options.map(r => {
      r.checked = false;
    });
    if (value) {
      this.selected = value;
      this.getValue();
    } else {
      this.value = "";
    }
    if (this.multiple) {
      let _selected = this.selected || [];
      let arr = [];
      this.selected = [];
      this.options.map(r => {
        if (_selected.indexOf(r.value) > -1) {
          r.checked = true;
          this.selected.push(r);
          this.selected.filter(i => {
            arr.push(i.text);
          });
        }
      });
      this.value = arr.join(",");
    }
  }

  registerOnChange(fn: Function) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouchedChange = fn;
  }

  onMultipleTotal(event: any) {
    this.multipleTotal = event.checked;
    if (this.multipleTotal) {
      this.selected = Array.from(this.options);
    } else {
      this.selected = [];
    }
    for (const option of this.options) {
      option["checked"] = event.checked;
    }
    this.getSelectedValue();
  }

  /**
   * 多选时选中或取消某一项
   */
  onCheckboxSelect(event: any, option: any) {
    if (event.checked) {
      option.checked = true;
      this.selected.push(option);
      if (this.filterValue(this.options, "text").length === this.selected.length) {
        this.multipleTotal = true;
      }
    } else {
      this.multipleTotal = false;
      const selected = this.selected;
      let i = selected.length;
      while (i) {
        if (selected[i - 1].value === event.value) {
          this.selected.splice(i - 1, 1);
        }
        i--;
      }
    }
    this.getSelectedValue();
  }

  compareWith(value: string) {
    let isEqual = false;
    if (value && this.selected) {
      if (Array.isArray(this.selected)) {
        for (const o of this.selected) {
          isEqual = this.objUtil.equals(value, o["value"]);
          break;
        }
      } else {   //改变手动选中的item背景色
        if (!this.selected.value) {
          isEqual = this.objUtil.equals(value, this.selected);
        } else {  //改变默认选中的item背景色
          isEqual = this.objUtil.equals(value, this.selected.value);
        }
      }
    }

    return isEqual;
  }

  onItemClick($event) {
    this.itemClick = $event;
    this.selected = $event;
    this.getSelectedValue();
  }

  /**
   * 设置value值
   */
  getValue() {
    this.value = "";
    const selectedValue = [];
    if (Array.isArray(this.selected)) {
      for (const s of this.selected) {
        selectedValue.push(s.text);
      }
      if (selectedValue.length > 0) {
        this.value = selectedValue.join(",");
      }
    } else if (this.selected) {
      let selected = this.options.filter(r => r.value === this.selected)[0];
      if (selected) {
        this.value = selected.text;
      } else {
        this.value = this.selected.text;
      }
    }
  }

  getSelectedValue() {
    this.getValue();
    if (Array.isArray(this.selected)) {
      let arr = [];
      this.selected.filter(r => {
        arr.push(r.value);
      });
      this.onModelChange(arr);
    } else {
      this.onModelChange(this.selected.value);
    }
  }

  onFilterChange(event: any) {
  }

  addGroup(value: TimiSelectItemComponent) {
    this.items.push(value);
  }

  onMenuClick() {
    this.itemClick = true;
  }

  onDocumentClickListener() {
    if (!this.bindDocumentClickListener) {
      this.bindDocumentClickListener = this.renderer2.listen("body", "click", () => {
        if (!this.selfClick && !this.itemClick) {
          this.close();
        }
        this.itemClick = false;
        this.selfClick = false;
      });
    }
  }

  offDocumentClickListener() {
    if (this.bindDocumentClickListener) {
      this.bindDocumentClickListener();
      this.bindDocumentClickListener = null;
    }
  }

  onClick() {
    if (!this.editable) {
      if (!this.opened) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  clickLi($event) {
    $event.stopPropagation();
  }

  filterValue(options: any[], value: string) {
    if (this.filter && options && Array.isArray(options)) {
      return options.filter((v, k, arr) => {
        const regexp = new RegExp(this._filterValue, "ig");
        if (regexp.test(v[value])) {
          return true;
        }
      });
    }
    return options;
  }

  open() {
    this.freeClickActive = true;
    this.selfClick = true;
    this.opened = true;
  }

  close() {
    this.freeClickActive = false;
    this.opened = false;
    this.selfClick = false;
  }

  ngOnDestroy() {
    this.offDocumentClickListener();
  }

}

@Component({
  selector: "free-select-item",
  template: `
    <li class="free-select-item" [class.free-select-active]="selector.compareWith(option.value)"
        (click)="itemClick()">
      <div class="free-select-item-content">
        <span>{{option.text}}</span>
      </div>
    </li>
  `,
  styles: [`
    .free-select-item {
      list-style: none;
      cursor: pointer;
    }

    .free-select-item:hover {
      background-color: #eee;
    }

    .free-select-active {
      background: #eee;
      font-weight: bold;
    }

    .free-select-item-content {
    @include flexbox;
      white-space: nowrap;
      justify-content: space-between;
      align-items: center;
      padding-left: 0.5rem;
    }
  `]
})

export class TimiSelectItemComponent implements OnInit {

  @Input() option: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  selector: TimiSelectComponent;

  constructor(selector: TimiSelectComponent) {
    this.selector = selector;
  }

  ngOnInit() {
    this.selector.addGroup(this);
  }

  itemClick() {
    this.onClick.emit(this.option);
  }
}

@NgModule({
  imports: [CommonModule, FormsModule, CheckboxModule],
  declarations: [TimiSelectComponent, TimiSelectItemComponent],
  exports: [TimiSelectComponent, TimiSelectItemComponent]
})

export class TimiSelectModule {
}
