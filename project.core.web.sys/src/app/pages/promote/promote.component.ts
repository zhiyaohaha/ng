import {ActivatedRoute, Router} from "@angular/router";
import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import {ITdDataTableColumn, TdDataTableSortingOrder, TdLoadingService} from "@covalent/core";
import {globalVar} from "../../common/global.config";
import {FnUtil} from "../../common/fn-util";
import {ToastService} from "../../component/toast/toast.service";
import {ConvertUtil} from "../../common/convert-util";
import {BaseService} from "../../services/base.service";
import {MdSidenav} from "@angular/material";
import {PromoteService} from "app/services/promote/promote.service";
import {CommonService} from "app/services/common/common.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {PermissionsService} from "app/services/permissions/permissions.service";
import {BaseUIComponent} from "../baseUI.component";


@Component({
  selector: "app-promote",
  templateUrl: "./promote.component.html",
  styleUrls: ["./promote.component.scss"],
  animations: [
    trigger("selectState", [
      state("attachmentsDisplay", style({})),
      transition(":enter", [
        style({
          transform: "translate(0, 80px)"  //从下面进入
        }), animate(".4s cubic-bezier(.25,.8,.25,1)")
      ])
    ])
  ],
  providers: [TdLoadingService, PromoteService, CommonService, PermissionsService]
})
export class PromoteComponent extends BaseUIComponent implements OnInit {
  [x: string]: any;

  @ViewChild("sidenav")
  private sidenav: MdSidenav;

  //权限
  authorities: string[];
  authorityKey: string; //权限关键字

  selectRow; //每一行的具体数据
  new: boolean; //是否新添加
  btnType: string; //表单模板按钮类型
  edit: boolean; //点击编辑过后变成true
  detail: boolean; //查看详情时变成true

  /**
   * 表格title
   */
  columns: ITdDataTableColumn[];

  /**
   * 表格数据
   */
  basicData;

  filters = [];
  searchFilters; //页面显示的搜索条件

  fromRow: number = 1; //当前页第一行的总行数
  currentPage: number = 0; //当前页码
  pageSize: number = globalVar.pageSize; //每页显示条数
  searchTerm: string = ""; //搜索关键字
  sortBy: string = "";
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  filteredTotal = 0; //总共条数
  filteredData; //过滤后的数据
  //搜索条件
  listparam = {
    size: this.pageSize,
    index: this.currentPage,
    filters: ""
  };

  modelDOMS; // 表单DOM结构

  pagecode: string;

  levels: Array<any> = [];

  datas: Array<any> = []; //接收的数据

  constructor(private fnUtil: FnUtil,
              private converUtil: ConvertUtil,
              private routerInfor: ActivatedRoute,
              private router: Router,
              private toastService: ToastService,
              private resolver: ComponentFactoryResolver,
              private el: ElementRef,
              private baseService: BaseService,
              private loading: TdLoadingService,
              private promoteService: PromoteService,
              private commonService: CommonService,
              private permissionsService: PermissionsService) {
    super(loading, routerInfor);

    routerInfor.paramMap
      .subscribe(res => {
        this.pagecode = this.fnUtil.getPageCode();
        this.authorities = this.fnUtil.getFunctions();
        this.authorityKey = this.pagecode;
        let paginationInfo = this.fnUtil.getPaginationInfo();

        /**
         * 每页条数pagesize和当前页码currentPage
         */
        this.pageSize = paginationInfo.pageSize;
        this.currentPage = paginationInfo.currentPage;
        if (this.authorityKey) {
          this.getParamsList({
            size: this.pageSize,
            index: this.currentPage,
            filters: ""
          });
        }
      });
  }

  ngOnInit() {
  }

  /**
   * 获取列表数据
   * @param params 传递的参数 size 每页条数  index 页码  filter 过滤条件
   */

  getParamsList(params) {
    this.loading.register("loading");
    this.commonService.getTableList(params)
      .subscribe(res => {
        this.loading.resolve("loading");
        if (res.code === "0") {
          let r = res;
          if (r.data.data && r.data.data.fields) {
            this.columns = r.data.data.fields;
          }
          if (r.data.data && r.data.data.bindData) {
            this.filteredData = this.basicData = r.data.data.bindData;
          }
          if (r.data.data && r.data.data.filters.length > 0) {
            r.data.data.filters.forEach(i => {
              this.filters.push({"key": i.name, "value": i.value || ""});
            });
            this.searchFilters = r.data.data.filters ? r.data.data.filters : false;
          }
          this.filteredTotal = r.data.total;
        } else {
          this.columns = [];
          this.filteredData = [];
        }
      });
  }

  /**
   * 搜索
   */
  onSearch($event) {
    this.listparam.filters = $event;
    this.getParamsList(this.listparam);
  }

  /**
   * 翻页
   */
  page($event) {
    this.listparam.index = $event.activeIndex;
    this.listparam.size = $event.pageSize;
    this.getParamsList(this.listparam);
  }

  /**
   * 点击行
   */
  rowClickEvent($event) {
    this.promoteService.getEditParams({userId: $event.row.id, level: "first"})
      .subscribe(r => {
        this.selectRow = r.data;
        for (let i = 0; i < this.selectRow.length; i++) {
          this.selectRow[i].checked = false;
        }
      });
  }

  /**
   * 添加
   */
  newAdd() {
    this.selectRow = "";
  }

  /**
   * 打开
   */
  sidenavOpen() {
  }

  /**
   * 关闭
   */
  closeEnd() {
  }

  //点击二级行的时候展示的内容
  showLevel(e, i) {
    this.selectRow[i].checked = !this.selectRow[i].checked;
    if (this.selectRow[i].checked === true) {
      this.promoteService.getEditParams({userId: this.selectRow[i].id, level: "first"})
        .subscribe(r => {
          this.levels[i] = r.data;
          console.log(r.data);
        });
    }
  }
}
