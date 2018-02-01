import {ActivatedRoute, Router} from "@angular/router";
import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnInit,
  ViewChild, ViewContainerRef
} from "@angular/core";
import {ITdDataTableColumn, TdDialogService, TdLoadingService} from "@covalent/core";
import {globalVar} from "../../common/global.config";
import {FnUtil} from "../../common/fn-util";
import {ToastService} from "../../component/toast/toast.service";
import {ConvertUtil} from "../../common/convert-util";
import {MdSidenav} from "@angular/material";
import {CommonService} from "app/services/common/common.service";
import {BaseUIComponent} from "app/pages/baseUI.component";
import {PhoneBookService} from "app/services/phone-book/phone-book.service";


@Component({
  selector: "app-phone-book",
  templateUrl: "./phone-book.component.html",
  styleUrls: ["./phone-book.component.scss"],
  providers: [TdLoadingService, CommonService, PhoneBookService]
})
export class PhoneBookComponent extends BaseUIComponent implements OnInit {
  [x: string]: any;

  @ViewChild("sidenav")
  private sidenav: MdSidenav;

  //权限
  authorities: string[];
  authorityKey: string; //权限关键字

  selectRow; //每一行的具体数据
  btnType: string; //表单模板按钮类型

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

  pagecode: string;

  //新增的通讯录部分所需的变量
  typeTab: number = 1; //tab切换  1是通话记录   2是通讯录

  recordData: any = {}; //通话记录数据
  addressData: any = {}; //通讯录数据
  //通话记录的pagesize,index
  recordPageSize: number = 10;
  recordActiveIndex: number = 0;
  //通讯录的pagesize,index
  addressPageSize: number = 10;
  addressActiveIndex: number = 0;
  personId: string; //选中行的id

  checkRocord: Array<any> = [];
  checkDetail: Array<any> = [];
  rowId: string;

  constructor(private fnUtil: FnUtil,
              private converUtil: ConvertUtil,
              private routerInfor: ActivatedRoute,
              private router: Router,
              private dialogService: TdDialogService,
              private viewContainerRef: ViewContainerRef,
              private toastService: ToastService,
              private resolver: ComponentFactoryResolver,
              private el: ElementRef,
              private loading: TdLoadingService,
              private commonService: CommonService,
              private phoneBookService: PhoneBookService) {

    super(loading, routerInfor);

    /**
     * 路由器结束订阅加载不同的页面
     * @type {Subscription}
     */

    this.routerInfor.paramMap
      .subscribe(res => {
        this.pagecode = this.fnUtil.getPageCode();

        this.authorities = this.fnUtil.getFunctions();
        this.authorityKey = this.pagecode;
        let paginationInfo = this.fnUtil.getPaginationInfo();

        /**
         * 每页条数pagesize和当前页码currentPage
         */
        this.pageSize = paginationInfo.pageSize;
        this.currentPage = paginationInfo.currentPage;
        if (this.authorityKey) {
          this.getParamsList({
            size: this.pageSize,
            index: this.currentPage,
            filters: ""
          });
        }
        this.selectRow = null;
        this.btnType = "new";

        if (el.nativeElement.querySelector(".mat-drawer-backdrop")) {
          el.nativeElement.querySelector(".mat-drawer-backdrop").click();
        }
      });
  }

  ngOnInit() {
  }

  /**
   * 获取列表数据
   * @param params 传递的参数 size 每页条数  index 页码  filter 过滤条件
   */

  getParamsList(params) {
    this.commonService.getTableList(params)
      .subscribe(r => {
        if (r.code === "0") {
          this.rowId = "";
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
    this.rowId = "";
    this.getParamsList(this.listparam);
  }

  /**
   * 点击行
   */
  rowClickEvent(e) {
    this.personId = e.id;
    this.phoneBookService.getRecord(this.personId, this.recordActiveIndex, this.recordPageSize).subscribe(res => {
      this.getRecordData(res.data);
    });
  }

  /**
   * 添加
   */
  newAdd() {
    this.selectRow = "";
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
    this.personId = "";
    this.recordPageSize = 10;
    this.recordActiveIndex = 0;
    this.addressPageSize = 10;
    this.addressActiveIndex = 0;
    this.typeTab = 1;
    this.addressData = {};
    this.recordData = {};
  }

  //获取通话记录数据
  getRecordData(res) {
    this.recordData = res;

  }

  //获取通讯录数据
  getAddressData(res) {
    this.addressData = res;
  }

  //通话记录列表
  toRecord() {
    this.typeTab = 1;
    this.checkRocord = [];
    this.phoneBookService.getRecord(this.personId, this.recordActiveIndex, this.recordPageSize).subscribe(res => {
      this.getRecordData(res.data);
    });
  }

  //通讯录列表
  toAddress() {
    this.typeTab = 2;
    this.checkDetail = [];
    this.phoneBookService.getAddressBook(this.personId, this.addressActiveIndex, this.addressPageSize).subscribe(res => {
      this.getAddressData(res.data);
    });
  }

  //通话记录分页
  recordChange(e) {
    this.recordPageSize = e.pageSize;
    this.recordActiveIndex = e.activeIndex;
    this.phoneBookService.getRecord(this.personId, this.recordActiveIndex, this.recordPageSize).subscribe(res => {
      this.getRecordData(res.data);
    });
  }

  //通讯录分页
  addressChange(e) {
    this.addressPageSize = e.pageSize;
    this.addressActiveIndex = e.activeIndex;
    this.phoneBookService.getAddressBook(this.personId, this.addressActiveIndex, this.addressPageSize).subscribe(res => {
      this.getAddressData(res.data);
    });
  }

  //删除通话记录数据
  deleteRocord() {
    let id = this.checkRocord.join(",");
    super.openConfirm({
      dialogService: this.dialogService,
      message: "确定要删除选中的记录吗？"
    }, (accept) => {
      if (accept) {
        this.phoneBookService.deleteRocords(id).subscribe(res => {
          if (res.success === true) {
            this.checkRocord = [];
            this.phoneBookService.getRecord(this.personId, this.recordActiveIndex, this.recordPageSize).subscribe(r => {
              this.getRecordData(r.data);
            });
          }
        });
      }
    });
  }

  //删除通讯录
  deleteDetail() {
    let id = this.checkDetail.join(",");
    super.openConfirm({
      dialogService: this.dialogService,
      message: "确定要删除选中的记录吗？",
    }, (accept) => {
      if (accept) {
        this.phoneBookService.deleteDetails(id).subscribe(res => {
          if (res.success === true) {
            this.checkDetail = [];
            this.phoneBookService.getAddressBook(this.personId, this.addressActiveIndex, this.addressPageSize).subscribe(r => {
              this.getAddressData(r.data);
            });
          }
        });
      }
    });
  }

  //删除行
  deleteRows() {
    console.log(this.pageSize)
    super.openConfirm({
      dialogService: this.dialogService,
      viewContainerRef: this.viewContainerRef,
      message: "确定要删除选中的记录吗？",
    }, (accept) => {
      if (accept) {
        this.phoneBookService.deleteRow(this.rowId).subscribe(res => {
          if (res.success === true) {
            this.getParamsList({
              size: this.pageSize,
              index: this.currentPage,
              filters: ""
            });
          }
        });
      }
    });
  }

  //获取勾选的所有ID
  rowChecked(e) {
    let arr = [];
    for (let i = 0; i < e.length; i++) {
      arr.push(e[i].id);
    }
    this.rowId = arr.join(",");
  }

  //全选
  // checkedAll(e) {
  //   this.recordCheck = !this.recordCheck;
  //   if (e.srcElement.checked == true) {
  //     for (let i = 0; i < this.recordData.phoneBookDetails.length; i++) {
  //       let isInarray = this.inArray(this.recordData.phoneBookDetails[i].id, this.checkRocord);
  //       if (!isInarray) {
  //         this.checkRocord.push(this.recordData.phoneBookDetails[i].id);
  //       }
  //     }
  //   } else if (e.srcElement.checked == false) {
  //     for (let i = 0; i < this.recordData.phoneBookDetails.length; i++) {
  //       this.removeByValue(this.checkRocord, this.recordData.phoneBookDetails[i].id)
  //     }
  //   }
  //   console.log(this.checkRocord);
  // }

  //选择行通话记录
  checkedRocord(e, item) {
    let isInarray = this.inArray(item.id, this.checkRocord);
    if (e.srcElement.checked === true && !isInarray) {
      this.checkRocord.push(item.id);
    } else if (e.srcElement.checked === false && isInarray) {
      this.removeByValue(this.checkRocord, item.id);
    }
  }

  //选择行通讯录
  checkedDetail(e, item) {
    let isInarray = this.inArray(item.id, this.checkDetail);
    if (e.srcElement.checked === true && !isInarray) {
      this.checkDetail.push(item.id);
    } else if (e.srcElement.checked === false && isInarray) {
      this.removeByValue(this.checkDetail, item.id);
    }
    console.log(this.checkDetail);
  }


  //删除数组中的特定值
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

  goToHistory() {
    this.router.navigateByUrl("/main/PhoneBook/PhoneBook.PhoneBook/history");
  }
}
