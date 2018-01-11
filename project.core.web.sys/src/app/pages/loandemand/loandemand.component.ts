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
import { LoandemandService } from "app/services/loandemand/loandemand.service";


@Component({
  selector: "app-loandemand",
  templateUrl: "./loandemand.component.html",
  styleUrls: ["./loandemand.component.scss"],
  animations: [fadeIn],
  providers: [TdLoadingService, CommonService, LoandemandService]
})
export class LoandemandComponent implements OnInit {

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

  routerSubscribe; //路由订阅事件

  pagecode: string; //页面代码

  sidenavType: number = 1; //1默认情况，点击行的时候展示的侧滑  2点击分发的时候展示的侧滑内容  3点击分发详情展示的内容

  selectArray: Array<any> = []; //选中的数组

  orgList: Array<any> = [];//组织机构列表
  userList: Array<any> = [];//业务员列表

  isShowUserList: boolean = false;//显示第二条
  isShowCheckedList: boolean = false;//显示第三条
  orgNames: Array<string> = [];
  orgId: Array<any> = [];
  userNames: Array<any> = [];

  objectArray: object = {};
  checkedRow: any;

  constructor(private sharepageService: SharepageService,
    private fnUtil: FnUtil,
    private converUtil: ConvertUtil,
    private routerInfo: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private resolver: ComponentFactoryResolver,
    private el: ElementRef,
    private baseService: BaseService,
    private lodaingService: TdLoadingService,
    private commonService: CommonService,
    private loandemandService: LoandemandService) {

    /**
     * 路由器结束订阅加载不同的页面
     * @type {Subscription}
     */
    this.routerSubscribe = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        this.pagecode = this.routerInfo.snapshot.queryParams["pageCode"];
        /**
         * 每页条数pagesize和当前页码currentPage
         */
        if (!localStorage.getItem(this.pagecode + "ps")) {
          localStorage.setItem(this.pagecode + "ps", "10");
          localStorage.setItem(this.pagecode + "cp", "0");
          this.getParamsList({
            size: 10,
            index: 0,
            filters: ""
          });
        } else {
          this.pageSize = parseInt(localStorage.getItem(this.pagecode + "ps"), 10);
          this.currentPage = parseInt(localStorage.getItem(this.pagecode + "cp"), 10);
          // let a = this.table.pageTo(parseInt(localStorage.getItem(this.pagecode + "cp"), 10));
          this.getParamsList({
            size: this.pageSize,
            index: localStorage.getItem(this.pagecode + "cp"),
            filters: ""
          });
        }
        this.selectRow = null;
        this.sidenavKey = "";
        this.btnType = "new";
        el.nativeElement.querySelector(".mat-drawer-backdrop").click();
        this.authorities = this.fnUtil.getFunctions();
        this.authorityKey = this.routerInfo.snapshot.queryParams["pageCode"];

        // this.loadDetailModel();
        this.loadModal();
      });

    /**
     * 加载动画
     */
    this.lodaingService.create({
      // name: "fullScreen",
      // type: "circular",
      // mode: "indeterminate"
      name: "fullScreen",
      mode: LoadingMode.Indeterminate,
      type: LoadingType.Circular,
      color: "warn"
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
        console.log(this.filteredData);
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
    this.sidenavType = 1;
    this.sidenavKey = "Detail";
    this.btnType = "edit";
    this.loadDetailModel({ id: $event.row.id });
  }

  /**
   * 获取模版
   */
  modalDOMS: HtmlDomTemplate;

  //临时代码3----资料收集 
  collect() {
    this.selectRow = "";
    this.sidenavKey = "";
    this.btnType = "new";
    this.sidenavKey = "Collection";
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
      if (value.triggerUrl) {
        let param = {};
        value.bindParamFields.forEach((item) => {
          param[item] = this.selectRow[item];
        });
        this.baseService.get("/api/" + value.triggerUrl, param).subscribe(res => {
          if (res.code === "0") {
            this.modelDOMS = res.data.doms;
            this.selectRow = res.data.bindData;
          }
        });
      }
    } else if (value.name === "HtmlDomCmd.API") {
      this.baseService.post("/api/" + value.triggerUrl, { id: this.selectRow.id }).subscribe(res => {
        this.toastService.creatNewMessage(res.message);
      });
    } else if (value.name === "HtmlDomCmd.Form") {
      alert(1);
      this.sidenavKey = "Form";
    }

  }

  /**
   * 返回详情
   */
  backClick() {
    this.sidenavKey = "Detail";
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
    this.sidenavKey = "";
    this.selectRow = null;
  }

  /**
   * 提交表单
   */
  submitMethod($event) {
    this.lodaingService.register("fullScreen");
    if (this.btnType === "new") {
      this.sharepageService.saveNewParams($event)
        .subscribe(res => {
          this.lodaingService.resolve("fullScreen");
          this.toastService.creatNewMessage(res.message);
          if (res.code === "0") {
            this.getParamsList(this.listparam);
          }
        });
    } else if (this.sidenavKey === "Form") {
      // 侧滑为表单，提交表单的表单接口由后台表单模板提供
      if ($event.cmds) {
        this.submitMoreURL($event.data, $event.cmds);
      }
    } else {
      this.sharepageService.saveEditParams($event)
        .subscribe(res => {
          this.lodaingService.resolve("fullScreen");
          this.toastService.creatNewMessage(res.message);
          if (res.code === "0") {
            this.getParamsList(this.listparam);
          }
        });
    }
    this.sidenav.close();
  }

  //提交表单的时候需要走多个接口的情况
  submitMoreURL(param, Urls: any[]) {
    Urls.forEach((item) => {
      this.baseService.post("/api/" + item.triggerUrl, param).subscribe(res => {
        this.lodaingService.resolve("fullScreen");
        this.toastService.creatNewMessage(res.message);
        if (res.code === "0") {
          this.getParamsList(this.listparam);
        }
      });
    });
  }

  createComponent(menus) {
    this.container.clear();
    const factory: ComponentFactory<SetAuthorityComponent> = this.resolver.resolveComponentFactory(SetAuthorityComponent);
    this.setAuthorityComponent = this.container.createComponent(factory);
  }

  //新增部分，三级分销所需内容

  //获取组织列表
  getUserListOrg(res) {
    this.orgList = res;
  }
  //获取业务员列表
  getUserLists(res) {
    this.userList = res;
  }
  //点击分发时的事件
  distribution() {
    this.sidenavType = 2;
    this.loandemandService.getOrg().subscribe(res => {
      this.getUserListOrg(res.data);
    })
  }
  //点击分发详情的事件
  distributionDetail() {
    this.sidenavType = 3;
    this.loandemandService.getDetail(111111).subscribe(res => {
      console.log(res);
    })
  }
  //获取选择的用户数据
  selectedRows(e) {
    this.selectArray = e.totalRow;
  }




  //点击组织列表的事件
  showUserList(e, item, checkedOrg, i) {
    let id = item.id;
    let name = item.name;
    this.isShowUserList = true;
    this.loandemandService.getUserList(id).subscribe(res => {
      this.getUserLists(res.data);
      // item.children = res.data;
      // console.log(item);
    })
    if(!this.inArray(name,this.orgNames)){
      this.orgNames.push(name);
      console.log(this.orgNames);
    }
  }
  //已选业务员列表显示
  showCheckedList(e, item, checkedUser) {
    this.isShowCheckedList = true;
    for(let i=0;i<this.orgNames.length;i++){
      
    }
  }






  //判断元素是否在数组中
  inArray(search: string, array: Array<string>) {
    for (let i in array) {
      if (array[i] === search) {
        return true;
      }
    }
    return false;
  }
  toObject(key, value) {
    this.objectArray[key] = value;
  }
  //分发需求
  onSubmit() {
    this.loandemandService.sendInfo("5a548f17403473283cedf38f", { "59ffee6df212b02194f35113": "5a05b6a35dc0602580ecd7cb" }).subscribe(res => {
      console.log(res);
    })
  }
}
