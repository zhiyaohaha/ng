import { HtmlDomTemplate } from './../../models/HtmlDomTemplate';
import { ParamsManageService } from './../../services/paramsManage-service/paramsManage.service';
import { OnepageService } from './../../services/onepage-service/onepage.service';
import { TdDataTableSortingOrder, ITdDataTableColumn } from '@covalent/core';
import { globalVar, customized } from './../../common/global.config';
import { fadeIn } from './../../common/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onepage',
  templateUrl: './onepage.component.html',
  styleUrls: ['./onepage.component.scss'],
  animations: [fadeIn]
})
export class OnepageComponent implements OnInit {

  constructor(private onepageService: ParamsManageService) { }

  ngOnInit() {
    this.getParamsList(this.listparam);
    this.loadModal();
  }

  /**
   * 表格title
   */
  columns: ITdDataTableColumn[];

  /**
   * 表格数据
   */
  basicData;

  filters = [];
  searchFilters;//页面显示的搜索条件

  fromRow: number = 1;//当前页第一行的总行数
  currentPage: number = 0;//当前页码
  pageSizes = globalVar.pageSizes;//可选的每页条数
  pageSize: number = globalVar.pageSize; //每页显示条数
  pageLinkCount = globalVar.pageLinkCount;//显示多少页码
  searchTerm: string = "";//搜索关键字
  sortBy: string = "";
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  filteredTotal = 0;//总共条数
  filteredData;//过滤后的数据

  /**
 * 获取列表数据
 * @param params 传递的参数 size 每页条数  index 页码  filter 过滤条件
 */
  listparam = {
    size: this.pageSize,
    index: this.currentPage,
    filters: null,
    name: customized.SysOperationLogConfig
  };
  getParamsList(params) {
    this.onepageService.getParams(params)
      .subscribe(res => {
        if (res.code == "0") {
          var r = res;
          this.columns = r.data.data.fields;
          this.filteredData = this.basicData = r.data.data.bindData;
          r.data.data.filters.forEach(i => {
            this.filters.push({ "key": i.name, "value": i.value || '' });
          })
          this.searchFilters = r.data.data.filters;
          this.filteredTotal = r.data.total;
          console.log(this.columns)
        }
      })
  }

  /**
   * 搜索
   */
  onSearch($event) { }

  /**
   * 翻页
   */
  page($event) { }

  /**
   * 选择项
   */
  selectedValue: string;
  /**
   * 标签
   */
  tags;
  chips;
  /**
   * 点击行
   */
  selectRow;
  rowClickEvent($event) {
    console.log("rowClick", $event);
    this.onepageService.getEditParams({ name: customized.SysOperationLogConfig, id: $event.row.id })
      .subscribe(r => {
        this.selectRow = r.data;
        this.selectedValue = r.data.platform;
        if (r.data.tags) this.setChips(r.data.tags);
      });
  }

  /**
   * 获取模版
   */
  modalDOMS: HtmlDomTemplate;
  modalData;
  newModalData;
  loadModal() {
    this.onepageService.editParamsModal({ name: customized.SysOperationLogConfig }).subscribe(r => {
      if (r.code == "0") {
        this.modalDOMS = r.data.doms;
        this.modalData = r.data;
        this.newModalData = r.data;
        console.log("this.newdata", this.newModalData);
      }
    })
  }

  /**
   * 标签
   */
  chipsChange($event) {
    console.log($event);
  }
  /**
   * 设置标签
   */
  setChips($event) {
    let arr = $event.replace(/\"/g, "");
    arr.map(r => {
      this.chips.push({
        value: r,
        delete: true
      })
    });
  }



  /**
   * 确定修改
   */
  subEdit($event) {
    console.log($event);
  }

  /**
   * 打开
   */
  sidenavOpen() { }

  /**
   * 关闭
   */
  closeEnd() { }

}