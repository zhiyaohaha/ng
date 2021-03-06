import {Component, OnInit} from "@angular/core";
import {TdLoadingService} from "@covalent/core";
import {ActivatedRoute, Router} from "@angular/router";
import {PostLoanManagementService} from "../../../services/post-loan-management/post-loan-management.service";
import {FnUtil} from "../../../common/fn-util";
import {BaseUIComponent} from "../../baseUI.component";
import {ConvertUtil} from "../../../common/convert-util";

/**
 * 营业部统计
 */
@Component({
  selector: "loan-branch-count",
  templateUrl: "./branch-count.component.html",
  styleUrls: ["./branch-count.component.scss"],
  providers: [PostLoanManagementService]
})
export class BranchCountComponent extends BaseUIComponent implements OnInit {
  searchDOMS; // 搜索组件DOM
  filters; // 搜索组件搜索条件

  headers; // 表头
  datas; // 表格数据
  totals: number; // 表格总条数
  pageSize: number; // 表格每页显示条数
  currentPage: number; // 当前激活页面

  totalLoanApprovedAmount = 0; // 总应还金额
  totalActualAmount = 0; // 总实际还款金额

  listparam = {
    index: 0,
    size: 10,
    filters: ""
  };
  pagecode: string;


  constructor(private loading: TdLoadingService,
              private router: Router,
              private routerInfor: ActivatedRoute,
              private postLoanManagementService: PostLoanManagementService,
              private fnUtil: FnUtil,
              private convertUtil: ConvertUtil) {
    super(loading, routerInfor);
  }

  ngOnInit() {

    this.pagecode = this.fnUtil.getPageCode();
    let paginationInfo = this.fnUtil.getPaginationInfo();
    this.pageSize = paginationInfo.pageSize;
    this.currentPage = paginationInfo.currentPage;
    this.listparam.index = this.currentPage;
    this.listparam.size = this.pageSize;

    this.initSearch();
    this.initHeaders();
    this.datas = [];
    this.totals = 0;

    this.getLists();
  }

  /**
   * 获取列表
   */
  getLists() {
    this.loading.register("loading");
    this.postLoanManagementService.getLists(this.listparam).subscribe(res => {
      this.loading.resolve("loading");
      if (res.code === "0") {
        this.datas = res.data.orgList;
        this.totals = res.data.total;
        this.totalLoanApprovedAmount = res.data.totalLoanApprovedAmount;
        this.totalActualAmount = res.data.totalActualAmount;
      }
    });
  }

  /**
   * 搜索
   * @param $event
   */
  onSearch($event) {
    this.listparam.filters = $event;
    this.getLists();
  }

  /**
   * 初始化搜索
   */
  initSearch() {
    this.searchDOMS = [{
      name: "keywords",
      type: "FieldFilterType.Keywords",
      ui: {
        label: "关键字",
        displayType: "HtmlDomDisplayType.Text",
        hidden: false,
        placeholder: "请输入关键字"
      }
    }];
  }

  /**
   * 初始化表格头部
   */
  initHeaders() {
    this.headers = [{
      hidden: true,
      label: "唯一标识",
      name: "id",
      pipe: ""
    }, {
      hidden: false,
      label: "名称",
      name: "name",
      pipe: ""
    }, {
      hidden: false,
      label: "公司类型",
      name: "_type",
      pipe: ""
    }, {
      hidden: false,
      label: "联系人姓名",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "联系人手机号码",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "状态",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "保证金",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "授信额度",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "已使用额度",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "剩余额度",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "订单数",
      name: "orderNum",
      pipe: ""
    }, {
      hidden: false,
      label: "总利息",
      name: "totalInterest",
      pipe: ""
    }, {
      hidden: false,
      label: "逾期数",
      name: "overdueNum",
      pipe: ""
    }];
  }

  /**
   * 点击表格的行执行的事件
   * @param $event
   */
  rowClickEvent($event) {
    console.log($event);
    this.router.navigateByUrl("/main/LoanCount/LoanAfter.LendingStatistics/" + $event.id);
  }

  /**
   * 翻页事件
   * @param $event
   */
  page($event) {
    this.listparam.index = $event.activeIndex;
    this.listparam.size = $event.pageSize;
    this.getLists();
  }
}
