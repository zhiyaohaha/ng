import { CommonModule } from "@angular/common";
import { Component, forwardRef, Input, NgModule, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CheckboxModule } from "../checkbox/checkbox.component";
import { FormsModule } from "@angular/forms";

const TIMI_CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimiCheckboxComponent),
  multi: true
};

@Component({
  selector: "timi-checkbox",
  template: `
    <div class="box form-item" *ngIf="checkboxs">
      <div *ngIf="multiple" class="box-item item-label label{{columns}}"><label>{{labelName}}</label></div>
      <div *ngIf="multiple" class="box-item item-control-wrapper wrapper{{columns}}">
      <div *ngIf="isShowSearch">
            <input type="text" [(ngModel)]="searchContent" (keyup)="toSearch()" _ngcontent-c27 class="item-input" placeholder="请输入关键词">            
      </div>
        <div #wrap class="item-control">      
          <free-checkbox [label]="'全选'"
                         [checked]="actived"
                         (onChange)="checkedAll($event)" *ngIf="isShowCheckAll"></free-checkbox>
          <ng-container *ngFor="let item of checkboxsed">
            <free-checkbox [value]="item.value" [label]="item.text" (onChange)="onChange($event)"
                           [checked]="checked && checked.indexOf(item.value) > -1"></free-checkbox>
          </ng-container>
        </div>
      </div>
      <div *ngIf="!multiple" class="box-item item-control-wrapper clearfix wrapper{{columns}}"
           style="margin-left: 30%;">
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

  actived = false; //默认是否全选
  checked: any; //默认选中的项
  outPutArr = []; //抛出结果数组

  searchContent: any;//输入值
  checkboxsed: Array<any>;//搜索中的值
  isShowSearch: boolean;//控制搜索框是否显示，大于等于10条数据时显示
  isShowCheckAll: boolean = true;//控制全选是否显示

  valueChange: Function = () => { };

  constructor() {
  }

  ngOnInit() {
    this.checkboxsed = this.checkboxs;
    console.log(this.checkboxs);
    if (this.checkboxs.length > 10) {
      this.isShowSearch = true;
    }else{
      this.isShowSearch = false;
    }
  }

  /**
   * 全选
   * @param $event
   */
  checkedAll($event) {
    this.actived = false;
    this.outPutArr = [];
    this.checked = [];
    if ($event.checked) {
      this.actived = true;
      this.outPutArr = [];
      this.checkboxs.filter(item => {
        this.outPutArr.push(item.value);
        this.checked.push(item.value);
      });
    }
    this.valueChange(this.outPutArr);
  }

  onChange($event) {
    if (this.multiple) {
      if ($event.checked) {
        this.outPutArr.push($event.value);
      } else {
        this.outPutArr.splice(this.outPutArr.indexOf($event.value), 1);
      }
      this.actived = this.outPutArr.length === this.checkboxs.length;
      this.valueChange(this.outPutArr);
    } else {
      this.valueChange($event.checked);
    }
  }

  writeValue(value: any) {


    this.checked = value; //设置默认选中的项
    if (value) {
      this.actived = value.length === this.checkboxs.length;
      this.outPutArr = value;
    }
  }

  registerOnChange(fn) {
    this.valueChange = fn;
  }

  registerOnTouched() {
  }

  toSearch() {
    this.checkboxsed = [];
    let str = this.searchContent;

    if (!this.searchContent) {
      this.checkboxsed = this.checkboxs;
      this.isShowCheckAll = true;
    } else {
      this.isShowCheckAll = false;
      this.checkboxs.map(item => {
        if (item.text.indexOf(str) > -1) {
          console.log(item.text);
          this.checkboxsed.push(item);
        }
      })
    }

    // if (this.checkboxsed.length === 0) {
    //   this.checkboxsed = this.checkboxs;
    //   alert('您搜索的值不存在，请重新输入!');
    // }
  }
}

@NgModule({
  imports: [CommonModule, CheckboxModule, FormsModule],
  declarations: [TimiCheckboxComponent],
  exports: [TimiCheckboxComponent]
})

export class TimiCheckboxModule {
}

