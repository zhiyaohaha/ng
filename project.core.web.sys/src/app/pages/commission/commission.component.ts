import {ActivatedRoute, Router} from "@angular/router";
import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import {HtmlDomTemplate} from "../../models/HtmlDomTemplate";
import {SharepageService} from "../../services/sharepage-service/sharepage.service";
import {ITdDataTableColumn, TdLoadingService} from "@covalent/core";
import {globalVar} from "../../common/global.config";
import {fadeIn} from "../../common/animations";
import {FnUtil} from "../../common/fn-util";
import {ToastService} from "../../component/toast/toast.service";
import {ConvertUtil} from "../../common/convert-util";
import {SetAuthorityComponent} from "../../component/set-authority/set-authority.component";
import {BaseService} from "../../services/base.service";
import {MdSidenav} from "@angular/material";

import {CommonService} from "app/services/common/common.service";
import {CommissionService} from "app/services/commission/commission.service";
import {BaseUIComponent} from "../baseUI.component";


@Component({
  selector: "app-commission",
  templateUrl: "./commission.component.html",
  styleUrls: ["./commission.component.scss"],
  animations: [fadeIn],
  providers: [TdLoadingService, CommonService]
})
export class CommissionComponent extends BaseUIComponent implements OnInit {

  setAuthorityComponent: ComponentRef<SetAuthorityComponent>;
  @ViewChild("authorityModal", {read: ViewContainerRef}) container: ViewContainerRef;
  @ViewChild("sidenav")
  private sidenav: MdSidenav;

  //权限
  authorities: string[];
  authorityKey: string; //权限关键字

  selectRow; //每一行的具体数据
  new: boolean; //是否新添加
  btnType: string; //表单模板按钮类型

  sidenavKey: string; //侧滑需要显示的组件判断值 Form ：表单模板  Detail ：详细模板  Other ：其他不明情况:）

  /**
   * 表格title
   */
  columns: ITdDataTableColumn[];

  filters = [];
  searchFilters; //页面显示的搜索条件

  currentPage: number = 0; //当前页码
  pageSize: number = globalVar.pageSize; //每页显示条数
  searchTerm: string = ""; //搜索关键字
  sortBy: string = "";
  filteredTotal = 0; //总共条数
  filteredData; //过滤后的数据
  //搜索条件
  listparam = {
    size: this.pageSize,
    index: this.currentPage,
    filters: ""
  };

  modelDOMS; // 表单DOM结构

  pagecode: string; //页面代码

  detailInfo: any; //侧滑数据

  temp: object = {}; //用来传数据的
  isShowDetail: number; //用来控制展示切换的 1审批中 2已返佣 3未返佣

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
              private commonService: CommonService,
              private commissionService: CommissionService) {
    super(loading, routerInfor);

    this.routerInfor.paramMap
      .subscribe(res => {
        let pageConfig = this.fnUtil.getPaginationInfo();
        this.pageSize = pageConfig.pageSize;
        this.currentPage = pageConfig.currentPage;

        this.getParamsList({
          size: this.pageSize,
          index: this.currentPage,
          filters: ""
        });
        if (this.el.nativeElement.querySelector(".mat-drawer-backdrop")) {
          this.el.nativeElement.querySelector(".mat-drawer-backdrop").click();
        }
        this.authorities = this.fnUtil.getFunctions();
        this.authorityKey = this.fnUtil.getPageCode();
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
    this.sharepageService.getParams(params)
      .subscribe(res => {
        this.loading.resolve("loading");
        if (res.code === "0") {
          let r = res;
          if (r.data.data && r.data.data.fields) {
            this.columns = r.data.data.fields;
          }
          if (r.data.data && r.data.data.bindData) {
            this.filteredData = r.data.data.bindData;
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
    this.sidenavKey = "Detail";
    this.btnType = "edit";
    this.loadDetailModel($event.id);
    if ($event._rakeBack === "审批中") {
      this.isShowDetail = 1;
    } else if ($event._rakeBack === "未返佣") {
      this.isShowDetail = 3;
    } else if ($event._rakeBack === "已返佣") {
      this.isShowDetail = 2;
    }
  }

  //临时代码3----资料收集
  collect() {
    this.selectRow = "";
    this.sidenavKey = "";
    this.btnType = "new";
    this.sidenavKey = "Collection";
  }

  loadDetailModel(param) {
    this.loading.register("loading");
    this.commissionService.getDetail(param).subscribe(res => {
      this.loading.resolve("loading");
      this.getDetail(res.data);
    });
  }

  getDetail(res) {
    this.detailInfo = res;
    for (let i = 0; i < this.detailInfo.userInfo.length; i++) {
      this.temp[this.detailInfo.userInfo[i].trade.id] = null;
    }
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
      this.baseService.post("/api/" + value.triggerUrl, {id: this.selectRow.id}).subscribe(res => {
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
    this.loading.register("loading");
    if (this.btnType === "new") {
      this.sharepageService.saveNewParams($event)
        .subscribe(res => {
          this.loading.resolve("loading");
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
          this.loading.resolve("loading");
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
    this.loading.register("loading");
    Urls.forEach((item) => {
      this.baseService.post("/api/" + item.triggerUrl, param).subscribe(res => {
        this.loading.resolve("loading");
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

  //通过提示
  toPass(item, i, pass, nopass) {
    let r = confirm("确定要把选中订单的返佣转入相关的用户账户吗？");
    let id = item.trade.id;
    if (r == true) {
      this.temp[id] = true;
    } else {
      pass.checked = false;
      nopass.checked = true;
    }
  }

  //不通过提示
  toNoPass(item, i, nopass, pass) {
    let r = confirm("确定要拒绝选中订单的返佣吗？");
    let id = item.trade.id;
    if (r === true) {
      this.temp[id] = false;
    } else {
      nopass.checked = false;
      pass.checked = true;
    }
  }

  //提交表单
  sendMassage() {
    this.commissionService.sendMessage(this.temp).subscribe(res => {
      console.log(res);
      if (res.code === "Fail") {
        alert(res.message);
      }
    });
  }


}
