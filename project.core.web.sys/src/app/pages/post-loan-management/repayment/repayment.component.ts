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

  totalAmountPayable = 0; // 总应还金额
  totalActualAmount = 0; // 总实际还款金额

  listparam = {
    index: 0,
    size: 10,
    filters: ""
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

    this.listparam.index = this.currentPage;
    this.listparam.size = this.pageSize;

    this.initSearch();
    this.initHeaders();

    this.getLists();
  }

  /**
   * 获取表格列表
   */
  getLists() {
    this.loading.register("loading");
    this.postLoanManagementService.getLists(this.listparam).subscribe(res => {
      this.loading.resolve("loading");
      if (res.code === "0") {
        this.datas = res.data.data.map(item => {
          if (item.repaymentWay === 3) {
            item._paymentVoucher2 = item._paymentVoucher.map(i => i.path);
          } else {
            item._paymentVoucher1 = item._paymentVoucher.map(i => i.path);
          }
          return item;
        });
        console.log(this.datas);
        this.totals = res.data.total;
        this.totalAmountPayable = res.data.totalAmountPayable;
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
    this.listparam.index = 0;
    this.currentPage = 0;
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
      label: "订单ID",
      name: "orderId",
      pipe: ""
    }, {
      hidden: false,
      label: "客户姓名",
      name: "_customer",
      pipe: ""
    }, {
      hidden: false,
      label: "营业部",
      name: "_orgData.name",
      pipe: ""
    }, {
      hidden: false,
      label: "产品",
      name: "_product.name",
      pipe: ""
    }, {
      hidden: false,
      label: "计划还款时间",
      name: "plannedTime",
      pipe: "HtmlPipe.DateTime"
    }, {
      hidden: false,
      label: "本金",
      name: "principal",
      pipe: ""
    }, {
      hidden: false,
      label: "利息",
      name: "interest",
      pipe: ""
    }, {
      hidden: false,
      label: "应还滞纳金",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "实际还款时间",
      name: "actualTime",
      pipe: "HtmlPipe.DateTime"
    }, {
      hidden: false,
      label: "实际还款金额",
      name: "actualAmount",
      pipe: ""
    }, {
      hidden: false,
      label: "实还滞纳金",
      name: "actualLateFee",
      pipe: ""
    }, {
      hidden: false,
      label: "凭证",
      name: "_paymentVoucher1",
      pipe: "HtmlPipe.ImageTag"
    }, {
      hidden: false,
      label: "还款类型",
      name: "repaymentWay",
      pipe: ""
    }, {
      hidden: false,
      label: "总部代还凭证",
      name: "_paymentVoucher2",
      pipe: "HtmlPipe.ImageTag"
    }, {
      hidden: false,
      label: "总部代还金额",
      name: "",
      pipe: ""
    }, {
      hidden: false,
      label: "操作人",
      name: "_user",
      pipe: ""
    }, {
      hidden: false,
      label: "备注",
      name: "remark",
      pipe: ""
    }];
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
}
