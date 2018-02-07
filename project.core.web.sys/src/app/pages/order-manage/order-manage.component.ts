import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  forwardRef,
  NgModule
} from "@angular/core";
import { HtmlDomTemplate } from "../../models/HtmlDomTemplate";
import { SharepageService } from "../../services/sharepage-service/sharepage.service";
import { ITdDataTableColumn, LoadingMode, LoadingType, TdDataTableSortingOrder, TdLoadingService } from "@covalent/core";
import { globalVar } from "../../common/global.config";
import { fadeIn } from "../../common/animations";
import { FnUtil } from "../../common/fn-util";
import { ToastService } from "../../component/toast/toast.service";
import { ConvertUtil } from "../../common/convert-util";
import { SetAuthorityComponent } from "../../component/set-authority/set-authority.component";
import { BaseService } from "../../services/base.service";
import { MdSidenav } from "@angular/material";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { CommonService } from "app/services/common/common.service";
import { BaseUIComponent } from "../baseUI.component";

@Component({
  selector: "app-order-manage",
  templateUrl: "./order-manage.component.html",
  styleUrls: ["./order-manage.component.scss"],
  animations: [fadeIn],
  providers: [TdLoadingService, CommonService]
})
export class OrderManageComponent extends BaseUIComponent implements OnInit {
  [x: string]: any;

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
  sidenavKey: string; //侧滑需要显示的组件判断值 Form ：表单模板  Detail ：详细模板  Other ：其他不明情况:）

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


  constructor(private sharepageService: SharepageService,
    private fnUtil: FnUtil,
    private converUtil: ConvertUtil,
    private routerInfor: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private resolver: ComponentFactoryResolver,
    private el: ElementRef,
    private baseService: BaseService,
    private loading: TdLoadingService,
    private commonService: CommonService) {
    super(loading, routerInfor);

    /**
     * 路由器结束订阅加载不同的页面
     * @type {Subscription}
     */
    this.routerInfor.paramMap
      .subscribe(res => {
        this.pagecode = res.get("pageCode");
        this.authorities = this.fnUtil.getFunctions();
        this.authorityKey = this.pagecode;

        let paginationInfo = this.fnUtil.getPaginationInfo();

        /**
         * 每页条数pagesize和当前页码currentPage
         */
        this.pageSize = paginationInfo.pageSize;
        this.currentPage = paginationInfo.currentPage;
        this.getParamsList({
          size: this.pageSize,
          index: this.currentPage,
          filters: ""
        });
        this.selectRow = null;
        this.new = true;
        this.edit = false;
        this.btnType = "new";
        if (el.nativeElement.querySelector(".mat-drawer-backdrop")) {
          el.nativeElement.querySelector(".mat-drawer-backdrop").click();
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
    this.sharepageService.getParams(params)
      .subscribe(res => {
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
    this.getParamsList(this.listparam);
  }

  /**
   * 翻页
   */
  page($event) {
    console.log($event);
    this.listparam.index = $event.activeIndex;
    this.listparam.size = $event.pageSize;
    localStorage.setItem(this.pagecode + "ps", this.listparam.size.toString());
    localStorage.setItem(this.pagecode + "cp", this.listparam.index.toString());
    this.getParamsList(this.listparam);
  }

  // modalData;
  newModalData;

  /**
   * 点击行
   */
  rowClickEvent($event) {
    this.new = false;
    this.sidenavKey = "Detail";
    this.btnType = "edit";
    this.loadDetailModel({ id: $event.id });
    // this.commonService.getDetailModel({id: $event.row.id})
    //   .subscribe(r => {
    //     this.selectRow = r.data.bindData;
    //     this.detailModel = r.data.doms;
    //   });
  }

  /**
   * 获取模版
   */
  modalDOMS: HtmlDomTemplate;

  /**
   * 添加
   */
  newAdd() {
    // this.selectRow = this.converUtil.toJSON(this.modalData);
    this.selectRow = "";
    this.new = true;
    this.edit = true;
    this.btnType = "new";
    this.sidenavKey = "Other";
  }

  // //-资料收集
  // collect(sidenavKey) {
  //   this.selectRow = "";
  //   this.new = true;
  //   this.edit = true;
  //   this.btnType = "edit";
  //   this.sidenavKey = sidenavKey;
  // }

  // //资料审核
  // audit(sidenavKey) {
  //   this.selectRow = "";
  //   this.sidenavKey = sidenavKey;
  // }

  // //待放款
  // waitLoan(sidenavKey) {
  //   this.selectRow = "";
  //   this.sidenavKey = sidenavKey;
  // }

  //设置侧滑模板 
  setSidenavKey(sidenavKey) {
    this.selectRow = "";
    this.sidenavKey = sidenavKey;
  }

  loadModal() {
    this.sharepageService.editParamsModal().subscribe(r => {
      if (r.code === "0") {
        this.modalDOMS = r.data.doms;
        // this.modalData = r.data.bindDataJson;
        this.newModalData = r.data;
      }
    });
  }

  loadDetailModel(param) {
    this.commonService.getDetailModel(param).subscribe(res => {
      if (res.code === "0") {
        this.selectRow = res.data.bindData;
        this.detailModel = res.data.doms;
      }
    });
  }

  /**
   * 详情组件点击事件
   */
  detailClick(value) {
    if (value.name === "HtmlDomCmd.Redirect") {
      this.sidenavKey = "Form";
      this.edit = true;
      if (value.triggerUrl) {
        let param = {};
        value.bindParamFields.forEach((item) => {
          param[item] = this.selectRow[item];
        });

        if (value.triggerUrl.indexOf("#") !== -1) {  //url里面有#(所以要截取一下)
          let status = value.triggerUrl.substr(1, value.triggerUrl.length);
          let statusId = status + "Id";
          this[statusId] = this.selectRow.id;
          this.setSidenavKey(status);

          // // 补充资料
          // this.setSidenavKey(value.triggerUrl.substr(1, value.triggerUrl.length));
          // // 审核资料
          // this.setSidenavKey(value.triggerUrl.substr(1, value.triggerUrl.length));
          // //待放款
          // this.setSidenavKey(value.triggerUrl.substr(1, value.triggerUrl.length));
        } else {
          this.baseService.get("/api/" + value.triggerUrl, param).subscribe(res => {
            if (res.code === "0") {
              this.modelDOMS = res.data.doms;
              this.selectRow = res.data.bindData;
            }
          });
        }

      }
    } else if (value.name === "HtmlDomCmd.API") {
      this.baseService.post("/api/" + value.triggerUrl, { id: this.selectRow.id }).subscribe(res => {
        this.toastService.creatNewMessage(res.message);
      });
    } else if (value.name === "HtmlDomCmd.Form") {
      this.sidenavKey = "Form";
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
    this.sidenavKey = "";
    this.detail = false;
    this.edit = false;
    this.selectRow = null;
  }

  /**
   * 提交表单
   */
  // submitMethod($event) {
  //   this.lodaingService.register("fullScreen");
  //   if (this.new) {
  //     this.sharepageService.saveNewParams($event)
  //       .subscribe(res => {
  //         this.lodaingService.resolve("fullScreen");
  //         this.toastService.creatNewMessage(res.message);
  //         if (res.code === "0") {
  //           this.getParamsList(this.listparam);
  //         }
  //       });
  //   } else if (this.sidenavKey === "Form") {
  //     // 侧滑为表单，提交表单的表单接口由后台表单模板提供
  //     if ($event.cmds) {
  //       this.submitMoreURL($event.data, $event.cmds);
  //     }
  //   } else {
  //     this.sharepageService.saveEditParams($event)
  //       .subscribe(res => {
  //         this.lodaingService.resolve("fullScreen");
  //         this.toastService.creatNewMessage(res.message);
  //         if (res.code === "0") {
  //           this.getParamsList(this.listparam);
  //         }
  //       });
  //   }
  //   this.sidenav.close();
  // }

  //提交表单的时候需要走多个接口的情况
  // submitMoreURL(param, Urls: any[]) {
  //   Urls.forEach((item) => {
  //     this.baseService.post("/api/" + item.triggerUrl, param).subscribe(res => {
  //       this.lodaingService.resolve("fullScreen");
  //       this.toastService.creatNewMessage(res.message);
  //       if (res.code === "0") {
  //         this.getParamsList(this.listparam);
  //       }
  //     });
  //   });
  // }

  createComponent(menus) {
    this.container.clear();
    const factory: ComponentFactory<SetAuthorityComponent> = this.resolver.resolveComponentFactory(SetAuthorityComponent);
    this.setAuthorityComponent = this.container.createComponent(factory);
  }

  //报单，申请贷款以后，跳转到补资料页面
  onGetOrderId($event) {
    console.log($event);
    this.sidenavKey = "FillInfo";
    this.FillInfoId = $event;
  }

  //提交完成以后，关闭侧滑，刷新数据 
  closeRefreshData() {
    this.sidenav.close();
    this.getParamsList(this.listparam);
  }
}
