import { ActivatedRoute, Router } from "@angular/router";
import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { HtmlDomTemplate } from "../../models/HtmlDomTemplate";
import { SharepageService } from "../../services/sharepage-service/sharepage.service";
import { ITdDataTableColumn, TdDataTableSortingOrder, TdLoadingService } from "@covalent/core";
import { globalVar } from "../../common/global.config";
import { fadeIn } from "../../common/animations";
import { FnUtil } from "../../common/fn-util";
import { ToastService } from "../../component/toast/toast.service";
import { SetAuthorityComponent } from "../../component/set-authority/set-authority.component";
import { BaseService } from "../../services/base.service";
import { MdSidenav } from "@angular/material";
import { BaseUIComponent } from "../baseUI.component";
import "rxjs/add/operator/switchMap";

@Component({
  selector: "app-sharepage",
  templateUrl: "./sharepage.component.html",
  styleUrls: ["./sharepage.component.scss"],
  animations: [fadeIn],
  providers: [TdLoadingService]
})
export class SharepageComponent extends BaseUIComponent implements OnInit {
  setAuthorityComponent: ComponentRef<SetAuthorityComponent>;
  @ViewChild("authorityModal", { read: ViewContainerRef }) container: ViewContainerRef;
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

  detailModel; //查询详情的模板
  modalDOMS: HtmlDomTemplate; //表单模版

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

  routerSubscribe; //路由订阅事件

  pagecode: string;

  //@ViewChild("table") table;

  constructor(private sharepageService: SharepageService,
    private fnUtil: FnUtil,
    private routerInfo: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private resolver: ComponentFactoryResolver,
    private el: ElementRef,
    private baseService: BaseService,
    private loadingService: TdLoadingService) {
    super(loadingService, routerInfo);

    /**
     * 路由器结束订阅加载不同的页面
     * @type {Subscription}
     */

    this.routerInfo.paramMap
      .subscribe(res => {
        this.pagecode = localStorage.getItem("pageCode");

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
        this.selectRow = null;
        this.new = true;
        this.edit = false;
        this.btnType = "new";
      });
  }

  ngOnInit() {
  }

  /**
   * 获取列表数据
   * @param params 传递的参数 size 每页条数  index 页码  filter 过滤条件
   */

  getParamsList(params) {
    this.loadingService.register("loading");
    this.sharepageService.getParams(params)
      .subscribe(res => {
        this.loadingService.resolve("loading");
        if (res.code === "0") {
          let r = res;
          if (r.data.data && r.data.data.fields) {
            this.columns = r.data.data.fields;
          }
          if (r.data.data && r.data.data.bindData) {
            this.filteredData = this.basicData = r.data.data.bindData;
          }
          if (r.data.data && r.data.data.filters.length > 0) {
            this.filters = [];
            r.data.data.filters.forEach(i => {
              this.filters.push({ "key": i.name, "value": i.value || "" });
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
    this.listparam.index = 0;
    this.currentPage = 0;
    this.getParamsList(this.listparam);
  }

  /**
   * 翻页
   */
  page($event): void {
    this.listparam.index = $event.activeIndex;
    this.listparam.size = $event.pageSize;
    this.currentPage = $event.activeIndex;
    this.getParamsList(this.listparam);
  }

  /**
   * 点击行
   */
  rowClickEvent($event) {
    this.new = false;
    this.detail = true;
    this.btnType = "edit";

    this.sharepageService.getDetailModel({ id: $event.id })
      .subscribe(res => {
        this.detailModel = res.data.doms;
        this.selectRow = res.data.bindData;
      });
  }

  /**
   * 添加
   */
  newAdd() {
    this.selectRow = "";
    this.new = true;
    this.edit = true;
    this.btnType = "new";
    this.sharepageService.editParamsModal().subscribe(r => {
      if (r.code === "0") {
        this.modalDOMS = r.data.doms;
      }
    });
  }

  /**
   * 详情组件点击事件
   */
  detailClick(value) {
    this.sharepageService.editParamsModal({ id: this.selectRow.id }).subscribe(r => {
      if (r.code === "0") {
        this.modalDOMS = r.data.doms;
      }
    });
    if (value.name === "HtmlDomCmd.Redirect") {
      this.detail = false;
      this.edit = true;
    } else if (value.name === "HtmlDomCmd.API") {
      this.baseService.post("/api/" + value.triggerUrl, { id: this.selectRow.id }).subscribe(res => {
        super.showToast(this.toastService, res.message);
      });
    }

  }

  /**
   * 返回详情
   */
  backClick() {
    this.detail = true;
    this.edit = false;
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
    this.detail = false;
    this.edit = false;
    this.selectRow = null;
  }

  /**
   * 提交表单
   */
  submitMethod($event) {
    this.loadingService.register("loading");
    if (this.new) {
      this.sharepageService.saveNewParams($event)
        .subscribe(res => {
          this.loadingService.resolve("loading");
          super.showToast(this.toastService, res.message);
          if (res.code === "0") {
            this.currentPage = 0;
            this.getParamsList(this.listparam);
          }
        });
    } else {
      this.sharepageService.saveEditParams($event)
        .subscribe(res => {
          this.loadingService.resolve("loading");
          super.showToast(this.toastService, res.message);
          if (res.code === "0") {
            this.getParamsList(this.listparam);
          }
        });
    }
    this.sidenav.close();
  }

  createComponent(menus) {
    this.container.clear();
    const factory: ComponentFactory<SetAuthorityComponent> = this.resolver.resolveComponentFactory(SetAuthorityComponent);
    this.setAuthorityComponent = this.container.createComponent(factory);
  }
}

@Component({
  selector: "form-unit",
  templateUrl: "./formunit.component.html",
  styleUrls: ["./formunit.component.scss"]
})

export class FormUnitComponent extends BaseUIComponent {

  @Input() DOMS;
  @Input() DOMSData;

  @Input()
  set selectRow(value) {
    console.log(value);
    this._selectRow = value;
  }

  get selectRow() {
    return this._selectRow;
  }

  @Input() bindDataJson;

  @Output() changes: EventEmitter<any> = new EventEmitter();

  tags = [];
  _selectRow; //修改数据内容

  constructor(private toastService: ToastService,
    private loadingService: TdLoadingService,
    private routerInfo: ActivatedRoute
  ) {
    super(loadingService, routerInfo);
  }

  submitMethod($event) {
    for (let key in $event) {
      if ($event[key]) {
        this.selectRow[key] = $event[key];
        if (this.selectRow["_" + key] && key !== "logo") {
          this.selectRow["_" + key] = null;
        }
      }
    }
    $event.id = this.selectRow.id;
    this.changes.emit($event);
  }

  /**
   * 选择文件
   */
  selected($event) {
    console.log($event.queue[0]);
  }

  /**
   * 上传完成
   */
  uploaded($event) {
    if ($event.isUploaded) {
      super.showToast(this.toastService, "上传成功");
    }
  }

  /**
   * 添加标签
   */
  chipsChange($event) {
    this.tags = $event;
  }


}
