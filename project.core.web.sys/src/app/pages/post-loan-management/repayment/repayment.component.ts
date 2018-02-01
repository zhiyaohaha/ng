import {Component, OnInit} from "@angular/core";
import {BaseUIComponent} from "../../baseUI.component";
import {TdLoadingService} from "@covalent/core";
import {ActivatedRoute} from "@angular/router";
import {FnUtil} from "../../../common/fn-util";
import {PostLoanManagementService} from "../../../services/post-loan-management/post-loan-management.service";

/**
 * 还款统计
 */
@Component({
  selector: "loan-repayment",
  templateUrl: "./repayment.component.html",
  styleUrls: ["./repayment.component.scss"],
  providers: [PostLoanManagementService]
})
export class RepaymentComponent extends BaseUIComponent implements OnInit {
  searchDOMS; // 搜索组件DOM
  filters; // 搜索组件搜索条件

  headers; // 表头
  datas; // 表格数据
  totals: number; // 表格总条数
  pageSize: number; // 表格每页显示条数
  currentPage: number; // 当前激活页面

  listparam = {
    index: 0,
    size: 10,
    filter: ""
  };
  pagecode: string;


  constructor(private loading: TdLoadingService,
              private routerInfor: ActivatedRoute,
              private postLoanManagementService: PostLoanManagementService,
              private fnUtil: FnUtil) {
    super(loading, routerInfor);
  }

  ngOnInit() {
    this.pagecode = this.fnUtil.getPageCode();
    let paginationInfo = this.fnUtil.getPaginationInfo();
    this.pageSize = paginationInfo.pageSize;
    this.currentPage = paginationInfo.currentPage;

    this.listparam.index = this.pageSize;
    this.listparam.size = this.pageSize;

    this.initSearch();
    this.initHeaders();

    this.getLists();
  }

  getLists() {
    this.loading.register("loading");
    this.postLoanManagementService.getLists(this.listparam).subscribe(res => {
      this.loading.resolve("loading");
      if (res.code === "0") {
        this.datas = res.data.data;
        this.totals = res.data.total;
      }
    });
  }

  /**
   * 搜索
   * @param $event
   */
  onSearch($event) {
    console.log($event);
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
      label: "订单ID",
      name: "ActualLateFee",
      pipe: ""
    }, {
      hidden: false,
      label: "客户姓名",
      name: "name",
      pipe: ""
    }, {
      hidden: false,
      label: "营业部",
      name: "OrgName.name",
      pipe: ""
    }, {
      hidden: false,
      label: "产品",
      name: "_productName.name",
      pipe: ""
    }, {
      hidden: false,
      label: "计划还款时间",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "本金",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "利息",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "应还滞纳金",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "实际还款时间",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "实还滞纳金",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "凭证",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "还款类型",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "总部代还品质",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "总部代还金额",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "操作人",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "备注",
      name: "",
      pipe: ""
    }];
  }

  /**
   * 点击表格的行执行的事件
   * @param $event
   */
  rowClickEvent($event) {
    console.log($event);
  }

  /**
   * 翻页事件
   * @param $event
   */
  page($event) {
    console.log($event);
  }
}
