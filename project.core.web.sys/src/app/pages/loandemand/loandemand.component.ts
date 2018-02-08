import {ActivatedRoute, Router} from "@angular/router";
import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import {HtmlDomTemplate} from "../../models/HtmlDomTemplate";
import {SharepageService} from "../../services/sharepage-service/sharepage.service";
import {ITdDataTableColumn, TdDataTableSortingOrder, TdLoadingService} from "@covalent/core";
import {globalVar} from "../../common/global.config";
import {fadeIn} from "../../common/animations";
import {FnUtil} from "../../common/fn-util";
import {ToastService} from "../../component/toast/toast.service";
import {ConvertUtil} from "../../common/convert-util";
import {SetAuthorityComponent} from "../../component/set-authority/set-authority.component";
import {BaseService} from "../../services/base.service";
import {MdSidenav} from "@angular/material";

import {CommonService} from "app/services/common/common.service";
import {LoandemandService} from "app/services/loandemand/loandemand.service";
import {BaseUIComponent} from "../baseUI.component";


@Component({
  selector: "app-loandemand",
  templateUrl: "./loandemand.component.html",
  styleUrls: ["./loandemand.component.scss"],
  animations: [fadeIn],
  providers: [TdLoadingService, CommonService, LoandemandService]
})
export class LoandemandComponent extends BaseUIComponent implements OnInit {

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

  currentPage: number = 0; //当前页码
  pageSize: number = globalVar.pageSize; //每页显示条数
  searchTerm: string = ""; //搜索关键字
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

  sidenavType: number = 1; //1默认情况，点击行的时候展示的侧滑  2点击分发的时候展示的侧滑内容  3点击分发详情展示的内容

  //三级分销部分内容
  selectArray: Array<any> = []; //选中的数组

  orgList: Array<any> = []; //组织机构列表
  userList: Array<any> = []; //业务员列表

  isShowUserList: boolean = false; //显示第二条
  isShowCheckedList: boolean = false; //显示第三条

  orgIdNow: string = "";

  loandemandInfo: Array<any> = [];

  //第二次
  orgIndex: number;
  lastShow: Array<any> = [];
  judgeArray: Array<any> = [];


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
              private loandemandService: LoandemandService) {
    super(loading, routerInfor);

    routerInfor.paramMap
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

        this.loadModal();
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
              this.filters.push({"key": i.name, "value": i.value || ""});
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
    this.listparam.index = $event.activeIndex;
    this.listparam.size = $event.pageSize;
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
    this.loadDetailModel({id: $event.row.id});
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
    // this.loading.register("loading");
    // if (this.btnType === "new") {
    //   this.sharepageService.saveNewParams($event)
    //     .subscribe(res => {
    //       this.loading.resolve("loading");
    //       this.toastService.creatNewMessage(res.message);
    //       if (res.code === "0") {
    //         this.getParamsList(this.listparam);
    //       }
    //     });
    // } else if (this.sidenavKey === "Form") {
    //   console.log($event);  
    //   // 侧滑为表单，提交表单的表单接口由后台表单模板提供
    //   if ($event.cmds) {
    //     this.submitMoreURL($event.data, $event.cmds);
    //   }
    // } else {
    //   this.sharepageService.saveEditParams($event)
    //     .subscribe(res => {
    //       this.loading.resolve("loading");
    //       this.toastService.creatNewMessage(res.message);
    //       if (res.code === "0") {
    //         this.getParamsList(this.listparam);
    //       }
    //     });
    // }
    // this.sidenav.close();
    this.sharepageService.saveEditParams($event)
      .subscribe(res => {
        console.log(res);
        this.loading.resolve("loading");
        super.showToast(this.toastService, res.message);
        if (res.code === "0") {
          this.getParamsList(this.listparam);
        }
      });
  }

  //提交表单的时候需要走多个接口的情况
  // submitMoreURL(param, Urls: any[]) {
  //   this.loading.register("loading");
  //   Urls.forEach((item) => {
  //     this.baseService.post("/api/" + item.triggerUrl, param).subscribe(res => {
  //       this.loading.resolve("loading");
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

  //新增部分，三级分销所需内容

  //获取组织列表
  getUserListOrg(res) {
    this.orgList = res;
  }

  //获取业务员列表
  getUserLists(res) {
    this.userList = res;
  }

  //获取选择的用户数据
  selectedRows(e) {
    console.log(e);
    this.selectArray = e.totalRow;
  }

  //获取分发详情信息
  getLoandemandInfo(res) {
    this.loandemandInfo = res;
  }

  //点击分发时的事件
  distribution() {
    if (this.selectArray[0]) {
      this.sidenavType = 2;
      this.sidenav.open();
      this.loandemandService.getOrg()
        .map(res => {
          let obj = [];
          let data = res.data;
          if (data.length > 0) {
            data.forEach(item => {
              obj.push({
                id: item.id,
                name: item.name,
                checked: false,
                children: []
              });
            });
            return obj;
          }
        })
        .subscribe(item => {
          this.getUserListOrg(item);
        });
    } else {
      super.showToast(this.toastService, "请选择用户");
    }
  }

  //点击分发详情的事件
  distributionDetail() {
    if (this.selectArray[0]) {
      this.sidenavType = 3;
      this.sidenav.open();
      this.loandemandService.getDetail(this.selectArray[0].id).subscribe(res => {
        this.getLoandemandInfo(res.data);
      });
    } else {
      super.showToast(this.toastService, "请选择用户");
    }
  }

  //点击组织列表的事件
  showUserList(e, i) {
    this.orgIdNow = this.orgList[i].id;
    this.isShowUserList = true;
    this.orgIndex = i;
    this.orgList[i].checked = true;
    this.loandemandService.getUserList(this.orgIdNow)
      .map(res => {
        let obj = [];
        let data = res.data;
        if (data.length > 0) {
          data.forEach(item => {
            obj.push({
              id: item.id,
              name: item.name,
              checked: false
            });
          });
        }
        return obj;
      })
      .subscribe(item => {
        this.getUserLists(item);
      });
  }

  //已选业务员列表显示
  showCheckedList(e, item, j) {
    let isInarray = this.inArray(this.orgList[this.orgIndex], this.lastShow);
    let inJudgeArray = this.inArray(this.userList[j].name, this.judgeArray);
    this.isShowCheckedList = true;
    if (!inJudgeArray) {
      this.userList[j].checked = true;
      this.orgList[this.orgIndex].children.push(this.userList[j]);
      this.judgeArray.push(this.userList[j].name);
    }
    if (this.orgList[this.orgIndex].checked && !isInarray) {
      this.lastShow.push(this.orgList[this.orgIndex]);
    }
  }

  //删除已选业务员
  removeRow(e, item) {
    let id = item.id;
    for (let i = 0; i < this.lastShow.length; i++) {
      for (let j = 0; j < this.lastShow[i].children.length; j++) {
        if (id === this.lastShow[i].children[j].id) {
          this.removeByValue(this.lastShow[i].children, item);
          this.removeByValue(this.judgeArray, item.name);
          if (this.lastShow[i].children.length === 0) {
            this.removeByValue(this.lastShow, this.lastShow[i]);
          }
        }
      }
    }
  }

  //删除数组中的特定元素
  removeByValue(arr, value) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        arr.splice(i, 1);
        break;
      }
    }
  }

  //判断元素是否在数组中
  inArray(search, array) {
    for (let i in array) {
      if (array[i] === search) {
        return true;
      }
    }
    return false;
  }

  //分发需求
  onSubmit() {
    let str = "";
    let obj = {};
    let idList = [];
    for (let i = 0; i < this.selectArray.length; i++) {
      idList.push(this.selectArray[i].id);
      str = idList.join(",");
    }
    for (let i = 0; i < this.lastShow.length; i++) {
      let arr = [];
      for (let j = 0; j < this.lastShow[i].children.length; j++) {
        arr.push(this.lastShow[i].children[j].id);
      }
      obj[this.lastShow[i].id] = arr.join(",");
    }
    this.loandemandService.sendInfo(str, obj).subscribe(res => {
      if (res.code === "0") {
        this.getParamsList(this.listparam);
      }
      console.log(res);
    });
    this.sidenav.close();
    this.isShowUserList = false;
    this.isShowCheckedList = false;
    this.lastShow = [];
    this.orgIdNow = "";
    this.judgeArray = [];
    this.orgList = [];
    this.userList = [];
  }
}
