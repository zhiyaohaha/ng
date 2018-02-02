import {Component, OnInit} from "@angular/core";
import {TdLoadingService} from "@covalent/core";
import {ActivatedRoute} from "@angular/router";
import {PostLoanManagementService} from "../../../services/post-loan-management/post-loan-management.service";
import {FnUtil} from "../../../common/fn-util";
import {BaseUIComponent} from "../../baseUI.component";

/**
 * 放款统计
 */
@Component({
  selector: "loan-count",
  templateUrl: "./loan-count.component.html",
  styleUrls: ["./loan-count.component.scss"],
  providers: [PostLoanManagementService]
})
export class LoanCountComponent extends BaseUIComponent implements OnInit {
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

  sidenavKey: string; // Detail 详细  Repayment 还款
  repaymentTypes; // 还款类型
  cid; // 公司ID

  orderDetail; // 订单基本信息
  repaymentPlan; // 还款计划

  pagecode: string;


  constructor(private loading: TdLoadingService,
              private activatedRoute: ActivatedRoute,
              private postLoanManagementService: PostLoanManagementService,
              private fnUtil: FnUtil) {
    super(loading, activatedRoute);
  }

  ngOnInit() {
    this.repaymentTypes = [{
      text: "客户还款",
      value: 1,
      childrens: null
    }, {
      text: "渠道商代还",
      value: 2,
      childrens: null
    }, {
      text: "总部代还",
      value: 3,
      childrens: null
    }];

    this.cid = this.activatedRoute.snapshot.paramMap.get("cid");

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
        this.datas = res.data.Lending;
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
    }, {
      name: "start",
      type: "FieldFilterType.Keywords",
      ui: {
        label: "放款开始日期",
        displayType: "HtmlDomDisplayType.Date",
        hidden: false,
        placeholder: ""
      }
    }, {
      name: "end",
      type: "FieldFilterType.Keywords",
      ui: {
        label: "放款结束日期",
        displayType: "HtmlDomDisplayType.Date",
        hidden: false,
        placeholder: ""
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
      name: "id",
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
      label: "客服",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "风控",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "批贷金额",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "年化",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "放款时间",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "还款方式",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "期数",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "已还期数",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "逾期数",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "已还金额",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "上次还款时间",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "下次应还时间",
      name: "",
      pipe: ""
    }];
  }

  /**
   * 点击表格的行执行的事件
   * @param $event
   */
  rowClickEvent($event) {
    this.sidenavKey = "Detail";
    this.getOrderDetail($event.id);
    this.getRepaymentPlan($event.id);
  }

  /**
   * 获取订单基本信息
   * @param id
   */
  getOrderDetail(id) {
    this.postLoanManagementService.getOrderDetail({id: id})
      .subscribe(res => {
        this.orderDetail = res.data;
      });
  }

  /**
   * 获取还款计划
   * @param id
   */
  getRepaymentPlan(id) {
    this.postLoanManagementService.getRepaymentPlan({id: id})
      .subscribe(res => {
        this.repaymentPlan = res.data.data;
      });
  }

  /**
   * 翻页事件
   * @param $event
   */
  page($event) {
    this.listparam.index = $event.activeIndex;
    this.listparam.size = $event.pageSize;
    this.currentPage = $event.activeIndex;
    this.getLists();
  }

  submitRepayment($event) {
    this.postLoanManagementService.submitRepayment($event)
      .subscribe(res => {
        console.log(res);
      });
  }
}
