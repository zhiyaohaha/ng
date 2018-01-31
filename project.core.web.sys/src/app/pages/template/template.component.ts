import {AfterViewInit, Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {ITdDataTableColumn, TdLoadingService} from "@covalent/core";
import {globalVar} from "../../common/global.config";
import {TableComponent} from "../../component/table/table.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MdSidenav} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {CommonService} from "../../services/common/common.service";
import {FnUtil} from "../../common/fn-util";
import {BaseUIComponent} from "../baseUI.component";

@Component({
  selector: "app-template",
  templateUrl: "./template.component.html",
  styleUrls: ["./template.component.scss"],
  providers: [CommonService]
})
export class TemplateComponent extends BaseUIComponent implements OnInit, AfterViewInit {
  selectRow; //每一行的具体数据
  dangerousUrl: string;
  trustedUrl;
  editUrl: string; //模板编辑url

  @ViewChild("sidenav")
  private sidenav: MdSidenav;

  sidenavHeight;

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

  pagecode: string;

  constructor(private router: Router,
              private commonService: CommonService,
              private fnUtil: FnUtil,
              private sanitizer: DomSanitizer,
              private el: ElementRef,
              private loading: TdLoadingService,
              private routerInfor: ActivatedRoute) {
    super(loading, routerInfor);
    this.routerInfor.paramMap
      .subscribe(res => {
        this.pagecode = this.fnUtil.getPageCode();

        /**
         * 每页条数pagesize和当前页码currentPage
         */
        let paginationInfo = this.fnUtil.getPaginationInfo();
        this.pageSize = paginationInfo.pageSize;
        this.currentPage = paginationInfo.currentPage;
        if (this.pagecode) {
          this.getParamsList({
            size: this.pageSize,
            index: this.currentPage,
            filters: ""
          });
        }
        if (el.nativeElement.querySelector(".mat-drawer-backdrop")) {
          el.nativeElement.querySelector(".mat-drawer-backdrop").click();
        }
      });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sidenavHeight = this.el.nativeElement.querySelector("#sidenav").clientHeight;
    }, 0);
  }

  /**
   * 获取列表数据
   * @param params 传递的参数 size 每页条数  index 页码  filter 过滤条件
   */

  getParamsList(params) {
    this.commonService.getTableList(params)
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
        }
      });
  }

  /**
   * 搜索
   */
  onSearch($event) {
    this.listparam.filters = $event;
    this.listparam.index = 0;
    this.currentPage = 0;
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
    this.setIframeSrc($event.id);
    // this.sharepageService.getEditParams({ id: $event.row.id })
    //   .subscribe(r => {
    //     this.selectRow = r.data;
    //   });
  }


  /**
   * 添加
   */
  newAdd() {
    this.setIframeSrc("");
  }

  /**
   *根据不同的url，设置不同的iframe src（添加和修改都跳转到iframe）
   */
  setIframeSrc(id) {
    //设置src
    switch (this.pagecode) {
      case "TemplateMgr.TableMgr":
        this.editUrl = "table";
        break;  //表格
      case "TemplateMgr.SelectMgr":
        this.editUrl = "mutilple";
        break;  //多选
      case "TemplateMgr.FormMgr":
        this.editUrl = "form";
        break;  //表单
      case "TemplateMgr.DetailMgr":
        this.editUrl = "detail";
        break;  //详细
    }
    if (id) {
      this.dangerousUrl = "../../../assets/manage-template/pages/" + this.editUrl + "Template.html?id=" + id;
    } else {
      this.dangerousUrl = "../../../assets/manage-template/pages/" + this.editUrl + "Template.html";
    }

    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousUrl);

    //根据iframe子页面高度，设置 iframe框的高度(编辑状态下，页面的高度是js后期处理的)
    // var that = this;
    // var iframeContentNav = this.iframeContent.nativeElement;   //这种方法只能设置初始高度
    // iframeContentNav.onload = function(){
    //   var contentHeight = iframeContentNav.contentWindow.document.getElementsByTagName('section')[0].scrollHeight;
    //   that.iframeHeight = contentHeight
    // }
  }

  /**
   * 侧滑打开
   */
  sidenavOpen() {

  }
}
