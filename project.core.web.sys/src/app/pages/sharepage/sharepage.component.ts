import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {
  Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, EventEmitter, Input, OnDestroy,
  OnInit, Output,
  ViewChild, ViewContainerRef
} from "@angular/core";
import { HtmlDomTemplate } from "./../../models/HtmlDomTemplate";
import { SharepageService } from "./../../services/sharepage-service/sharepage.service";
import { TdDataTableSortingOrder, ITdDataTableColumn } from "@covalent/core";
import { globalVar, customized } from "./../../common/global.config";
import { fadeIn } from "./../../common/animations";
import { FnUtil } from "./../../common/fn-util";
import {ToastService} from "../../component/toast/toast.service";
import {ConvertUtil} from "../../common/convert-util";
import {SetAuthorityComponent} from "../../component/set-authority/set-authority.component";
import {environment} from "../../../environments/environment";

@Component({
  selector: "app-sharepage",
  templateUrl: "./sharepage.component.html",
  styleUrls: ["./sharepage.component.scss"],
  animations: [fadeIn]
})
export class SharepageComponent implements OnInit, OnDestroy {
  setAuthorityComponent: ComponentRef<SetAuthorityComponent>;
  @ViewChild("authorityModal", {read: ViewContainerRef}) container: ViewContainerRef;

  //权限
  authorities: string[];
  authorityKey: string; //权限关键字

  selectRow; //每一行的具体数据
  new: boolean; //是否新添加

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

  fromRow: number = 1; //当前页第一行的总行数
  currentPage: number = 0; //当前页码
  pageSizes = globalVar.pageSizes; //可选的每页条数
  pageSize: number = globalVar.pageSize; //每页显示条数
  pageLinkCount = globalVar.pageLinkCount; //显示多少页码
  searchTerm: string = ""; //搜索关键字
  sortBy: string = "";
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  filteredTotal = 0; //总共条数
  filteredData; //过滤后的数据
  //搜索条件
  listparam = {
    size: this.pageSize,
    index: this.currentPage,
    filters: null,
    name: customized.SysOperationLogConfig
  };

  routerSubscribe; //路由订阅事件

  @ViewChild("table")
  private table: ElementRef;

  constructor(private sharepageService: SharepageService,
              private fnUtil: FnUtil,
              private converUtil: ConvertUtil,
              private routerInfo: ActivatedRoute,
              private router: Router,
              private toastService: ToastService,
              private resolver: ComponentFactoryResolver
  ) {
    this.authorities = this.fnUtil.getFunctions();
    this.authorityKey = this.routerInfo.snapshot.queryParams["pageCode"];
    this.routerSubscribe = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        this.getParamsList({
          size: this.pageSize,
          index: 0,
          filters: null,
          name: customized.SysOperationLogConfig
        });
      });
  }

  ngOnInit() {
    //this.getParamsList(this.listparam);
    this.loadModal();
    // this.routerInfo.events.subscribe(r=>{
    //   console.log("路由订阅：",r)
    // })
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
          this.columns = r.data.data.fields;
          this.filteredData = this.basicData = r.data.data.bindData;
          r.data.data.filters.forEach(i => {
            this.filters.push({ "key": i.name, "value": i.value || "" });
          })
          this.searchFilters = r.data.data.filters;
          this.filteredTotal = r.data.total;
        }
      });
  }

  /**
   * 搜索
   */
  onSearch($event) { }

  /**
   * 翻页
   */
  page($event) {
    console.log($event);
    this.listparam.index = $event.page - 1;
    this.getParamsList(this.listparam);
  }

  /**
   * 选择项
   */
  selectedValue: string;
  /**
   * 标签
   */
  tags;
  chips;

  /**
   * 添加
   */
  newAdd() {
    this.selectRow = this.converUtil.toJSON(this.modalData);
    this.new = true;
  }
  /**
   * 点击行
   */
  rowClickEvent($event) {
    this.new = false;
    this.sharepageService.getEditParams({ id: $event.row.id })
      .subscribe(r => {
        this.selectRow = r.data;
        if (r.data.tags) {
          this.setChips(r.data.tags);
        }
      });
  }

  /**
   * 获取模版
   */
  modalDOMS: HtmlDomTemplate;
  modalData;
  newModalData;
  loadModal() {
    this.sharepageService.editParamsModal().subscribe(r => {
      if (r.code === "0") {
        this.modalDOMS = r.data.doms;
        this.modalData = r.data.bindDataJson;
        this.newModalData = r.data;
      }
    });
  }

  /**
   * 标签
   */
  chipsChange($event) {
    console.log($event);
  }
  /**
   * 设置标签
   */
  setChips($event) {
    let arr = $event.replace(/\"/g, "");
    arr.map(r => {
      this.chips.push({
        value: r,
        delete: true
      });
    });
  }


  /**
   * 打开
   */
  sidenavOpen() { }

  /**
   * 关闭
   */
  closeEnd() { }

  /**
   * 提交表单
   */
  submitMethod($event) {
    if (this.new) {
      this.sharepageService.saveNewParams($event)
        .subscribe(res => {
          this.toastService.creatNewMessage(res.message);
          if (res.code === "0") {
            this.getParamsList(this.listparam);
          }
        });
    } else {
      this.sharepageService.saveEditParams($event).subscribe(res => {
        this.toastService.creatNewMessage(res.message);
      });
    }

  }

  createComponent(menus) {
    this.container.clear();
    const factory: ComponentFactory<SetAuthorityComponent> = this.resolver.resolveComponentFactory(SetAuthorityComponent);
    this.setAuthorityComponent = this.container.createComponent(factory);
  }

  ngOnDestroy(): void {
    this.routerSubscribe.unsubscribe();
  }

}

@Component({
  selector: "form-unit",
  templateUrl: "./formunit.component.html",
  styleUrls: ["./formunit.component.scss"]
})

export class FormUnitComponent {

  @Input() DOMS;
  @Input()
  set selectRow(value) {
    console.log(value);
    this._selectRow = value;
    if (value && value.logo) {
      this.fileId = value.logo;
    }
  }
  get selectRow() {
    return this._selectRow;
  }

  @Input() bindDataJson;

  @Output() changes: EventEmitter<any> = new EventEmitter();

  fileId;
  tags = [];
  _selectRow; //修改数据内容

  constructor(private toastService: ToastService) {}

  submitMethod($event) {
    for (let key in $event) {
      this.selectRow[key] = $event[key];
    }
    console.log(this.selectRow);
    this.changes.emit(this.selectRow);
  }

  /**
   * 选择文件
   */
  selected($event) {
    console.log($event.queue[0]);
  }

  /**
   * 上传完成
   */
  uploaded($event) {
    if ($event.isUploaded) {
      this.toastService.creatNewMessage("上传成功");
      this.fileId = $event.id;
    }
  }

  /**
   * 添加标签
   */
  chipsChange($event) {
    this.tags = $event;
  }


}
