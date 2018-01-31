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

  pagecode: string;


  constructor(private loading: TdLoadingService,
              private routerInfor: ActivatedRoute,
              private postLoanManagementService: PostLoanManagementService,
              private fnUtil: FnUtil) {
    super(loading, routerInfor);

    this.routerInfor.paramMap
      .subscribe(res => {
        this.pagecode = this.fnUtil.getPageCode();

        let paginationInfo = this.fnUtil.getPaginationInfo();

        /**
         * 每页条数pagesize和当前页码currentPage
         */
        this.pageSize = paginationInfo.pageSize;
        this.currentPage = paginationInfo.currentPage;
        this.getLists({
          size: this.pageSize,
          index: this.currentPage,
          filters: ""
        });

      });
  }

  ngOnInit() {
    this.sidenavKey = "Repayment";
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
  }

  getLists(param) {
    this.loading.register("loading");
    this.postLoanManagementService.getLists(param).subscribe(res => {
      this.loading.resolve("loading");
      if (res.code === "0") {
        if (res.data.total) {
          this.searchDOMS = res.data.data.filters;
          this.headers = res.data.data.fields;
          this.datas = res.data.data.bindData;
          this.totals = res.data.total;
        }
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
    this.listparam.index = $event.activeIndex;
    this.listparam.size = $event.pageSize;
    this.currentPage = $event.activeIndex;
    this.getLists(this.listparam);
  }
}
