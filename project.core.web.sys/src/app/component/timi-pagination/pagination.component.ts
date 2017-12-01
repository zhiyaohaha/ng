import {CommonModule} from "@angular/common";
import {Component, EventEmitter, Input, NgModule, OnInit, Output} from "@angular/core";
import {MdSelectModule} from "@angular/material";
import {globalVar} from "../../common/global.config";
import {FormsModule} from "@angular/forms";

@Component({
  selector: "timi-pagination",
  template: `
    <div class="free-pagination">
      <span [style.fontSize.px]="12">每页条数：</span>
      <md-select [style.width.px]="50" [(ngModel)]="pageSize" (change)="changePageSize($event)">
        <md-option *ngFor="let size of pageSizes" [value]="size">
          {{size}}
        </md-option>
      </md-select>
      <ul>
        <timi-pagination-item [disabled]="isFirst" (click)="changePageToFirst()">
          <i class="fa fa-backward"></i>
        </timi-pagination-item>
        <timi-pagination-item [disabled]="isFirst" (click)="changePageToPrev()">
          <i class="fa fa-angle-left"></i>
        </timi-pagination-item>
        <timi-pagination-item *ngFor="let page of _total;" [active]="page === activeIndex" (click)="changePage(page)">
          {{page + 1}}
        </timi-pagination-item>
        <timi-pagination-item [disabled]="isLast" (click)="changePageToNext()">
          <i class="fa fa-angle-right"></i>
        </timi-pagination-item>
        <timi-pagination-item [disabled]="isLast" (click)="changePageToLast()">
          <i class="fa fa-forward"></i>
        </timi-pagination-item>
      </ul>
    </div>
  `,
  styleUrls: ["./pagination.component.scss"]
})
export class TimiPaginationComponent implements OnInit {

  _total = [];
  _activeIndex = 0; //当前页码
  _pageSize = 10; //当前每页条数
  pageSizes = globalVar.pageSizes; //可选页码
  lastIndex: number;
  @Input() maxPage = 5;
  @Input()
  set activeIndex(value: number) {
    this._activeIndex = value;
  }
  get activeIndex() {
    return this._activeIndex;
  }
  @Input()
  set pageSize(value) {
    this._pageSize = value;
  }
  get pageSize() {
    return this._pageSize;
  }
  isFirst: boolean;
  isLast: boolean;
  first = 0;

  @Input()
  set total(value: number) {
    for (let i = 0; i < value; i++) {
      this._total.push(i);
    }
  }

  get total(): number {
    return this._total.length - 1;
  }

  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.lastIndex = this.total;
  }

  ngOnInit() {
    this.checkStartOrEnd();
  }

  /**
   * 检查是否首页末页
   */
  checkStartOrEnd() {
    this.isFirst = (this.activeIndex === 0);
    this.isLast = (this.activeIndex === this.total);
  }

  /**
   * 到首页
   */
  changePageToFirst() {
    if (!this.isFirst) {
      this.activeIndex = 0;
      this.changePage(this.activeIndex);
    }
  }

  /**
   * 上一页
   */
  changePageToPrev() {
    if (!this.isFirst) {
      --this.activeIndex;
      this.changePage(this.activeIndex);
    }
  }

  /**
   * 到page页
   * @param {number} page 页码
   */
  changePage(page: number) {

    if (this.maxPage < this.total) {

    }


    this.activeIndex = page;
    this.onChange.emit({
      pageSize: this.pageSize,
      activeIndex: page
    });
    this.checkStartOrEnd();
  }

  /**
   * 下一页
   */
  changePageToNext() {
    if (!this.isLast) {
      ++this.activeIndex;
      this.changePage(this.activeIndex);
    }
  }

  /**
   * 最后一页
   */
  changePageToLast() {
    if (!this.isLast) {
      this.activeIndex = this.total;
      this.changePage(this.activeIndex);
    }
  }

  /**
   * 改变每页条数
   */
  changePageSize($event) {
    this.pageSize = $event.value;
    this.onChange.emit({
      pageSize: this.pageSize,
      activeIndex: this.activeIndex
    });
  }
}

@Component({
  selector: "timi-pagination-item",
  template: `
    <li class="free-pagination-item" [class.free-pagination-active]="active"
        [class.free-pagination-disabled]="disabled">
      <a>
        <ng-content></ng-content>
      </a>
    </li>
  `
})

export class TimiPaginationItemComponent implements OnInit {

  activeIndex: number;
  pagination: any;
  @Input() active: number;
  @Input() disabled: boolean;

  constructor(pagination: TimiPaginationComponent) {
    this.pagination = pagination;
  }

  ngOnInit() {
    this.activeIndex = this.pagination.activeIndex;
  }
}

@NgModule({
  imports: [CommonModule, FormsModule, MdSelectModule],
  declarations: [TimiPaginationComponent, TimiPaginationItemComponent],
  exports: [TimiPaginationComponent, TimiPaginationItemComponent]
})

export class TimiPaginationModule {
}
