import { globalVar } from './../../common/global.config';
import { CommonModule } from '@angular/common';
import { ITdDataTableColumn, CovalentDataTableModule, CovalentPagingModule } from '@covalent/core';
import {
  NgModule, Component, OnInit, Input, Output, ViewChild, ViewChildren,
  ContentChildren, ElementRef, QueryList, EventEmitter, Renderer2, TemplateRef, ContentChild,
} from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss']
})

export class TableComponent implements OnInit {

  @Input() data;
  @Input() columns: ITdDataTableColumn[];
  @Input() totals;
  @Input() pageSizes;
  @Input() pageLinkCount;
  @Output() rowClick: EventEmitter<any> = new EventEmitter();
  @Output() rowSelect: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();

  constructor() { }
  ngOnInit() { }

  /**
   * 点击行
   */
  rowClickEvent($event) {
    this.rowClick.emit($event);
  }

  /**
   * 选择行
   */
  rowSelectEvent($event) {
    this.rowSelect.emit($event);
  }

  /**
   * 翻页
   */
  page($event) {
    this.change.emit($event);
  }
}

@NgModule({
  imports: [CommonModule, CovalentDataTableModule, CovalentPagingModule],
  declarations: [TableComponent],
  exports: [TableComponent]
})

export class TableModule { }