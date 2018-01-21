import {CommonModule} from "@angular/common";
import {Component, EventEmitter, Input, NgModule, OnInit, Output} from "@angular/core";
import {MdSelectModule} from "@angular/material";
import {globalVar} from "../../common/global.config";
import {FormsModule} from "@angular/forms";
import {FnUtil} from "../../common/fn-util";

@Component({
  selector: "timi-pagination",
  template: `
    <div class="free-pagination">
      <span class="small-span">每页条数：</span>
      <md-select [style.width.px]="50" [(ngModel)]="pageSize" (change)="changePageSize($event)">
        <md-option *ngFor="let size of pageSizes" [value]="size">
          {{size}}
        </md-option>
      </md-select>
      <span class="small-span">共{{pageCount}}页</span>
      <span class="small-span">共{{totalRecord || 0}}条</span>
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
  totalRecord: number; //总条数
  pageCount: number; //总页数
  start: number;
  end: number;

  @Input() //传入的页数
  set total(value: number) {
    this.totalRecord = value;
    this.pageCount = Math.ceil(value / this.pageSize);
    this._total = [];
    for (let i = 0; i < this.pageCount; i++) {
      this._total.push(i);
    }
    if (this.maxPage > this.pageCount) {
      this.countPage(this.pageCount);
    } else if (this.maxPage < this.pageCount) {
      const middle = Math.floor(this.maxPage / 2);
      this.start = this.activeIndex - middle;
      this.end = this.activeIndex + middle;
      if (this.maxPage < this.pageCount && this.start <= 0) {
        this.start = 0;
        this.end = this.maxPage - 1;
      }
      if (this.maxPage < this.pageCount && this.end >= this.pageCount) {
        this.start = this.pageCount - this.maxPage;
        this.end = this.pageCount - 1;
      }
      this.countPage(this.end, this.start);
    }
  }

  get total(): number {
    return this.totalRecord;
  }

  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(private fnUtil: FnUtil) {
  }

  ngOnInit() {
    this.checkStartOrEnd();
  }

  /**
   * 检查是否首页末页
   */
  checkStartOrEnd() {
    this.isFirst = (this.activeIndex === 0);
    this.isLast = (this.activeIndex === this.pageCount - 1);
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

    const middle = Math.floor(this.maxPage / 2);
    this.start = page - middle;
    this.end = page + middle;
    if (this.maxPage < this.pageCount && this.start <= 0) {
      this.start = 0;
      this.end = this.maxPage - 1;
    }
    if (this.maxPage < this.pageCount && this.end >= this.pageCount) {
      this.start = this.pageCount - this.maxPage;
      this.end = this.pageCount - 1;
    }
    if (this.maxPage > this.pageCount) {
      this.start = 0;
      this.end = this.pageCount;
    }
    this.countPage(this.end, this.start);


    this.activeIndex = page;
    this.onChange.emit({
      pageSize: this.pageSize,
      activeIndex: page
    });
    this.checkStartOrEnd();
    this.setPagination(this.pageSize.toString(), page.toString());
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
      this.activeIndex = this.pageCount - 1;
      this.changePage(this.activeIndex);
    }
  }

  countPage(end: number, start = 0) {
    this._total = [];
    if (this.pageCount <= this.maxPage) {
      start = 0;
      end = this.pageCount - 1;
    }
    for (let i = start; i <= end; i++) {
      this._total.push(i);
    }
  }

  /**
   * 改变每页条数
   */
  changePageSize($event) {
    this.pageSize = $event.value;
    this.activeIndex = 0;
    let end;
    this.pageCount = Math.ceil(this.totalRecord / this.pageSize);
    if (this.pageCount <= this.maxPage) {
      end = this.pageCount;
    } else {
      end = this.maxPage - 1;
    }
    this.countPage(end);
    this.onChange.emit({
      pageSize: this.pageSize,
      activeIndex: 0
    });
    this.setPagination(this.pageSize.toString(), "0");
  }

  /**
   * 设置当前页面的页码
   * @param {string} ps 每页条数
   * @param {string} cp 当前页码
   */
  setPagination(ps: string, cp: string) {
    localStorage.setItem(this.fnUtil.getPageCode() + "ps", ps);
    localStorage.setItem(this.fnUtil.getPageCode() + "cp", cp);
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
