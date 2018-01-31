import { Component, OnInit } from "@angular/core";
import {TdLoadingService} from "@covalent/core";
import {ActivatedRoute} from "@angular/router";
import {PostLoanManagementService} from "../../../services/post-loan-management/post-loan-management.service";
import {FnUtil} from "../../../common/fn-util";
import {BaseUIComponent} from "../../baseUI.component";

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
    console.log($event);
  }
}
