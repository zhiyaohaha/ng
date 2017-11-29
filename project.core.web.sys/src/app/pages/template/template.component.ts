import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {ITdDataTableColumn, LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import {globalVar} from "../../common/global.config";
import {TableComponent} from "../../component/table/table.component";
import {SharepageService} from "../../services/sharepage-service/sharepage.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {MdSidenav} from "@angular/material";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: "app-template",
  templateUrl: "./template.component.html",
  styleUrls: ["./template.component.scss"],
  providers: [SharepageService]
})
export class TemplateComponent implements OnInit, AfterViewInit {

  selectRow; //每一行的具体数据
  selectRowId; //每一行的id
  dangerousUrl:any;
  trustedUrl:any;
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
  pageLinkCount = globalVar.pageLinkCount; //显示多少页码
  filteredTotal = 0; //总共条数
  filteredData; //过滤后的数据
  //搜索条件
  listparam = {
    size: this.pageSize,
    index: this.currentPage,
    filters: ""
  };

  routerSubscribe; //路由订阅事件

  pagecode: string;
  @ViewChild("table")
  private table: TableComponent;

  constructor(private sharepageService: SharepageService,
              private routerInfo: ActivatedRoute,
              private router: Router,
              private lodaingService: TdLoadingService,
              private sanitizer: DomSanitizer
  ) {
    this.pagecode = this.routerInfo.snapshot.queryParams["pageCode"];
    /**
     * 每页条数pagesize和当前页码currentPage
     */
    if (!localStorage.getItem(this.pagecode + "ps")) {
      localStorage.setItem(this.pagecode + "ps", this.pageSize.toString());
      localStorage.setItem(this.pagecode + "cp", this.currentPage.toString());
    } else {
      this.pageSize = parseInt(localStorage.getItem(this.pagecode + "ps"), 10);
    }



    /**
     * 路由器结束订阅加载不同的页面
     * @type {Subscription}
     */
    this.routerSubscribe = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        this.getParamsList({
          size: localStorage.getItem(this.pagecode + "ps"),
          index: localStorage.getItem(this.pagecode + "cp"),
          filters: ""
        });
      });

    /**
     * 加载动画
     */
    this.lodaingService.create({
      name: "fullScreen",
      mode: LoadingMode.Indeterminate,
      type: LoadingType.Circular,
      color: "warn"
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (localStorage.getItem(this.pagecode + "cp")) {
        this.table.pageTo(parseInt(localStorage.getItem(this.pagecode + "cp"), 10) + 1);
      }
    }, 0);
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
    this.listparam.index = $event.page - 1;
    this.listparam.size = $event.pageSize;
    localStorage.setItem(this.pagecode + "ps", this.listparam.size.toString());
    localStorage.setItem(this.pagecode + "cp", this.listparam.index.toString());
    this.getParamsList(this.listparam);
  }

  /**
   * 点击行
   */
  rowClickEvent($event) {
    // this.selectRowId =  $event.row.id;
    this.dangerousUrl = '../../../assets/manage-template/pages/detailTemplate.html?id='+$event.row.id;
            // http://localhost:4200/assets/manage-template/pages/detailTemplate.html
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousUrl);
    // this.sharepageService.getEditParams({ id: $event.row.id })
    //   .subscribe(r => {
    //     this.selectRow = r.data;
    //   });
  }


  /**
   * 添加
   */
  newAdd() {
  }

}
