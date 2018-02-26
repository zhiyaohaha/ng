import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
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
  ViewContainerRef
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { forEach } from "@angular/router/src/utils/collection";
import { ToastService } from "../toast/toast.service";
import { TdLoadingService, TdDialogService } from "@covalent/core";
import { ActivatedRoute } from "@angular/router";
import { BaseUIComponent } from "../../pages/baseUI.component";

const TIMI_CHIP_GROUP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimiChipGroupComponent),
  multi: true
};

@Component({
  selector: "timi-chip-group",
  template: `
    <div class="label-wrap">
      <label>{{labeName}}</label>
    </div>
    <div class="chip-wrap" onkeydown="if(event.keyCode==13){return false;}">
      <div class="timi-chip-group" [ngClass]="chipClass">
        <timi-chip *ngFor="let chip of value;let i = index;" [value]="clickFilter?chip.label:chip" (click)="clickFilter?lightChip(i):delChip(i)" [timiChipActive]="timiChipActive" [timiChipActiveIndex]="i"></timi-chip>
        <input spellcheck="false" type="text" placeholder="{{placeholder}}"
               (focus)="onFocus()" (blur)="onBlur($event)" (keyup.enter)="onEnter($event)" (dragover)="allowDrop($event)"
               (drop)="drop($event)">
      </div>
    </div>
  `,
  styleUrls: ["./chip.component.scss"],
  providers: [TIMI_CHIP_GROUP_VALUE_ACCESSOR]
})

export class TimiChipGroupComponent extends BaseUIComponent implements ControlValueAccessor, OnInit {

  @Input()
  set chips(value: any) {
    this.value = [];
    for (const v of value) {
      let label;
      if (this.clickFilter) {
        label = v['label'];
      } else {
        label = v;
      }

      const isExited = this.value.find((elem, index, array) => {
        if (this.clickFilter) {  //点击删除和点击高亮的数据结构是不一样的、
          return elem['label'] == label;
        } else {
          return elem == label;
        }
      });
      if (!isExited) {
        if (this.clickFilter) {  //点击删除和点击高亮的数据结构是不一样的、
          this.chips.push({ 'label': label, 'status': v['status'] });
        } else {
          this.value.push(label);
        }
      } else {
        // alert('已有重复项')
        super.openAlert({ title: "提示", message: "已有重复项", dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
      }
    }
    //还原标签状态
    if (this.clickFilter && value.length > 0) {
      value.forEach((element, index) => {
        this.timiChipActive[index] = element['status'];
      });
    }
    this._propagateChange(this.chips);
  }

  get chips(): any {
    return this.value;
  }

  @Output() chipsChange: EventEmitter<any> = new EventEmitter();
  @Input() labeName: string;
  @Input()
  set placeholder(value) {
    if (value) {
      this._placeholder = value;
    }
  }
  get placeholder() {
    return this._placeholder;
  }
  @Input() columns: number;
  chipClass = {};
  focus: boolean;
  groups: TimiChipComponent[] = [];
  value: any[] = [];
  _placeholder = "回车添加";
  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() inputFocus: EventEmitter<any> = new EventEmitter();
  @Input() clickFilter: boolean;  //是否启用“点击单个标签,高亮选中该标签”的交互，是否禁用“点击单个标签删除该标签”的交互；
  timiChipActive: any[] = [];  //存储多个标签，是否高亮状态的集合

  private _propagateChange = (_: any) => { };

  constructor(private er: ElementRef,
    private toastService: ToastService,
    private loadingService: TdLoadingService,
    private routerInfor: ActivatedRoute,
    private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef) {
    super(loadingService, routerInfor);
  }

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
    this.inputFocus.emit();
  }

  onBlur($event) {
    this.blur.emit(this.chips);
    this.focus = !this.focus;
    this.setChipClass();
  }

  onEnter(event: any) {
    const value = event.target.value.trim();
    if (value) {
      if (this.clickFilter) {  //点击删除和点击高亮的数据结构是不一样的、
        this.chips.push({ 'label': value, 'status': true });
      } else {
        this.chips.push(value);
      }
      this.chips = this.chips.slice();  //Angular不会比较数组内容和对象属性，它只比较对象标识。在此通知Angular更改检测更新绑定
      event.target.value = "";
    }
    this.chipsChange.emit(this.chips);
    this._propagateChange(this.chips);
    return false;
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

  delChip(index) {  //点击删除   
    this.value.splice(index, 1);
  }
  lightChip(index) {   //点击高亮
    this.timiChipActive[index] = !this.timiChipActive[index];
    this.chips[index]['status'] = !this.chips[index]['status'];
  }

  writeValue(value: any) {
    if (value) {
      this.chips = value;
    } else {
      this.chips = [];
    }
  }

  registerOnChange(fn) {
    this._propagateChange = fn;
  }

  registerOnTouched() {
  }
}

@Component({
  selector: "timi-chip",
  template: `
    <div #container class="timi-chip" tabindex="0" [ngClass]="{'timi-chip-active':timiChipActive[timiChipActiveIndex]}">{{value}}</div>
  `
})
export class TimiChipComponent implements OnInit, AfterViewInit, OnDestroy {

  protected group: TimiChipGroupComponent;
  @Input() value: any;
  @Input() delete: boolean;
  @Input() timiChipActive: any;   //是否高亮的数组
  @Input() timiChipActiveIndex: any;  //指定哪一个标签高亮
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

export class TimiChipModule {
}

