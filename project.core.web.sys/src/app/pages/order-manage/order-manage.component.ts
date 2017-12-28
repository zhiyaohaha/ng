import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  forwardRef,
  NgModule
} from "@angular/core";
import { HtmlDomTemplate } from "../../models/HtmlDomTemplate";
import { SharepageService } from "../../services/sharepage-service/sharepage.service";
import { ITdDataTableColumn, LoadingMode, LoadingType, TdDataTableSortingOrder, TdLoadingService } from "@covalent/core";
import { globalVar } from "../../common/global.config";
import { fadeIn } from "../../common/animations";
import { FnUtil } from "../../common/fn-util";
import { ToastService } from "../../component/toast/toast.service";
import { ConvertUtil } from "../../common/convert-util";
import { SetAuthorityComponent } from "../../component/set-authority/set-authority.component";
import { BaseService } from "../../services/base.service";
import { MdSidenav } from "@angular/material";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

//import { OrderService } from "app/services/order/order.service";


export const ORDERMANAGE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OrderManageComponent),
  multi: true
};

@Component({
  selector: "app-order-manage",
  templateUrl: "./order-manage.component.html",
  styleUrls: ["./order-manage.component.scss"],
  animations: [fadeIn],
  providers: [TdLoadingService]
})
export class OrderManageComponent implements OnInit, OnDestroy {
  [x: string]: any;

  setAuthorityComponent: ComponentRef<SetAuthorityComponent>;
  @ViewChild("authorityModal", { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild("sidenav")
  private sidenav: MdSidenav;

  //权限
  authorities: string[];
  authorityKey: string; //权限关键字

  selectRow; //每一行的具体数据
  new: boolean; //是否新添加
  btnType: string; //表单模板按钮类型
  edit: boolean; //点击编辑过后变成true
  detail: boolean; //查看详情时变成true

  detailModel; //查询详情的模板

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
  pageSize: number = globalVar.pageSize; //每页显示条数
  searchTerm: string = ""; //搜索关键字
  sortBy: string = "";
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
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

  //新增部分
  // productType: Array<any> = [];
  // productDetail: any;
  // checked: boolean = false;
  // productId: string;
  // showAuthentication: boolean = false;
  // errorOfPerson: number;//用于判断展示错误信息
  // errorMessage: string = '身份证号码格式不正确!';//用于输出错误信息
  // phoneNum: string;//手机号码
  // phoneCode: string;//手机验证码
  // showCodeError: boolean = false;
  // errorCode: string;
  // showBankError: boolean = false;
  // errorBank:string;
  // idCard: string;//身份证号码
  // bankCard: string;//银行卡号
  // idCardPositiveImage: string;//身份证正面
  // idCardOppositeImage: string;//身份证背面
  // photo: string;//个人生活照片
  // //personData: object = { "id": "5a435c273aa0a708ac67c1d6", "portrait": "http://data.cpf360.com/development/2017/12/27/5a4309943bc243c0280778bc.png?x-oss-process=image/crop,x_868,y_411,w_188,h_228", "face": "http://data.cpf360.com/development/2017/12/27/5a4308a43bc243c0280778b4.png?x-oss-process=image/crop,x_787,y_960,w_977,h_1402", "confidence": 78, "similarity": "高", "name": "李萌", "_sex": "男", "age": 23, "nation": "汉", "domicile": "湖北省房县白鹤乡石堰河村3组131号"};//人物详细信息
  // personData: object;
  // showPersonData: boolean = false;//是否展示人物详细信息
  // btnDisabled: boolean = true;//验证码按钮是否打开
  // productsStyle: boolean = false;

  constructor(private sharepageService: SharepageService,
    private fnUtil: FnUtil,
    private converUtil: ConvertUtil,
    private routerInfo: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private resolver: ComponentFactoryResolver,
    private el: ElementRef,
    private baseService: BaseService,
    private lodaingService: TdLoadingService,
    //private orderService: OrderService
  ) {

    /**
     * 路由器结束订阅加载不同的页面
     * @type {Subscription}
     */
    this.routerSubscribe = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        this.pagecode = this.routerInfo.snapshot.queryParams["pageCode"];
        /**
         * 每页条数pagesize和当前页码currentPage
         */
        if (!localStorage.getItem(this.pagecode + "ps")) {
          localStorage.setItem(this.pagecode + "ps", "10");
          localStorage.setItem(this.pagecode + "cp", "0");
          this.getParamsList({
            size: 10,
            index: 0,
            filters: ""
          });
        } else {
          this.pageSize = parseInt(localStorage.getItem(this.pagecode + "ps"), 10);
          this.currentPage = parseInt(localStorage.getItem(this.pagecode + "cp"), 10);
          // let a = this.table.pageTo(parseInt(localStorage.getItem(this.pagecode + "cp"), 10));
          this.getParamsList({
            size: this.pageSize,
            index: localStorage.getItem(this.pagecode + "cp"),
            filters: ""
          });
        }
        this.selectRow = null;
        this.new = true;
        this.edit = false;
        this.btnType = "new";
        el.nativeElement.querySelector(".mat-drawer-backdrop").click();
        this.authorities = this.fnUtil.getFunctions();
        this.authorityKey = this.routerInfo.snapshot.queryParams["pageCode"];

        this.loadDetailModel();
        this.loadModal();
      });

    /**
     * 加载动画
     */
    this.lodaingService.create({
      // name: "fullScreen",
      // type: "circular",
      // mode: "indeterminate"
      name: "fullScreen",
      mode: LoadingMode.Indeterminate,
      type: LoadingType.Circular,
      color: "warn"
    });
  }

  ngOnInit() {
    // this.orderService.getType().subscribe(res => {
    //   this.getProductType(res.data[0].childrens);
    // })
    // this.orderService.getProductDetail().subscribe(res => {
    //   this.getProductDetail(res.data);
    // })
  }

  // //产品数据
  // getProductType(res) {
  //   this.productType = res;
  // }
  // //产品详情数据
  // getProductDetail(res) {
  //   this.productDetail = res;
  // }
  // //获取电话验证码
  // getPhoneNum($event, phoneNum) {
  //   let phoneReg = /(13\d|14[579]|15\d|17[01235678]|18\d)\d{8}/i;
  //   this.phoneNum = phoneNum.value;
  //   if (phoneReg.test(this.phoneNum)) {
  //     this.btnDisabled = false;
  //     console.log(this.phoneNum);
  //   }
  //   this.orderService.getCodeInfo(this.phoneNum).subscribe(res => {
  //     console.log(res);
  //   })
  // }
  // //输入的验证码
  // getCode(e, code) {
  //   let regexp = /^[0-9]{4}$/;
  //   this.phoneCode = code.value;
  //   if (regexp.test(this.phoneCode)) {
  //     this.showCodeError = false;
  //   } else {
  //     this.showCodeError = true;
  //     this.errorCode = '验证码格式不正确，请输入长度为4的数字'
  //   }
  // }
  // //点击展示产品详情
  // changeStyle(e, liActive, i) {
  //   this.productsStyle = true;
  //   this.index = i;
  //   this.productId = this.productDetail[i].id;
  //   this.showAuthentication = true;

  // }
  // //银行卡号
  // getbankCard(e, bankNum) {
  //   let regexp = /^[0-9]{10,19}$/;
  //   this.bankCard = bankNum.value;
  //   if(regexp.test(this.bankCard)){
  //     this.showBankError = false;
  //   }else{
  //     this.showBankError = true;
  //     this.errorBank = '输入的银行卡格式不正确!';
  //   }
  // }
  // //验证身份证号码
  // authentication(e, person) {
  //   let regexp = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  //   this.idCard = person.value;
  //   if (regexp.test(this.idCard)) {
  //     this.errorOfPerson = 1;
  //     this.orderService.getPersonInfo(this.idCard, this.productId).subscribe(res => {
  //       console.log(res);
  //       this.errorMessage = res.message;
  //     })
  //   } else {
  //     this.errorOfPerson = 2;
  //     this.errorMessage = '身份证号码格式不正确!';
  //   }
  // }
  // //上传成功
  // uploaded1(e) {
  //   this.idCardPositiveImage = e.id;
  // }
  // uploaded2(e) {
  //   this.idCardOppositeImage = e.id;
  // }
  // uploaded3(e) {
  //   this.photo = e.id;
  // }

  //认证数据
  // onSubmit() {
  //   this.orderService.getInfo(this.phoneCode, this.idCard, this.bankCard, this.phoneNum, this.idCardPositiveImage, this.idCardOppositeImage, this.photo).subscribe(res => {
  //     this.personData = res.data;
  //     this.showPersonData = res.success;
  //   })
  // }


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
    console.log($event);
    this.listparam.index = $event.activeIndex;
    this.listparam.size = $event.pageSize;
    localStorage.setItem(this.pagecode + "ps", this.listparam.size.toString());
    localStorage.setItem(this.pagecode + "cp", this.listparam.index.toString());
    this.getParamsList(this.listparam);
  }

  // modalData;
  newModalData;
  /**
   * 点击行
   */
  rowClickEvent($event) {
    this.new = false;
    this.detail = true;
    this.btnType = "edit";
    this.sharepageService.getEditParams({ id: $event.row.id })
      .subscribe(r => {
        this.selectRow = r.data;
      });
  }

  /**
   * 获取模版
   */
  modalDOMS: HtmlDomTemplate;

  /**
   * 添加
   */
  newAdd() {
    // this.selectRow = this.converUtil.toJSON(this.modalData);
    this.selectRow = "";
    this.new = true;
    this.edit = true;
    this.btnType = "new";
  }

  loadModal() {
    this.sharepageService.editParamsModal().subscribe(r => {
      if (r.code === "0") {
        this.modalDOMS = r.data.doms;
        // this.modalData = r.data.bindDataJson;
        this.newModalData = r.data;
      }
    });
  }
  loadDetailModel() {
    this.sharepageService.getDetailModel().subscribe(res => {
      if (res.code === "0") {
        this.detailModel = res.data.doms;
      }
    });
  }

  /**
   * 详情组件点击事件
   */
  detailClick(value) {
    console.log(this.selectRow);
    if (value.name === "HtmlDomCmd.Redirect") {
      this.detail = false;
      this.edit = true;
    } else if (value.name === "HtmlDomCmd.API") {
      this.baseService.post("/api/" + value.triggerUrl, { id: this.selectRow.id }).subscribe(res => {
        this.toastService.creatNewMessage(res.message);
      });
    }

  }

  /**
   * 返回详情
   */
  backClick() {
    this.detail = true;
    this.edit = false;
  }

  /**
   * 打开
   */
  sidenavOpen() { }

  /**
   * 关闭
   */
  closeEnd() {
    this.detail = false;
    this.edit = false;
    this.selectRow = null;
  }

  /**
   * 提交表单
   */
  submitMethod($event) {
    this.lodaingService.register("fullScreen");
    if (this.new) {
      this.sharepageService.saveNewParams($event)
        .subscribe(res => {
          this.lodaingService.resolve("fullScreen");
          this.toastService.creatNewMessage(res.message);
          if (res.code === "0") {
            this.getParamsList(this.listparam);
          }
        });
    } else {
      this.sharepageService.saveEditParams($event)
        .subscribe(res => {
          this.lodaingService.resolve("fullScreen");
          this.toastService.creatNewMessage(res.message);
          if (res.code === "0") {
            this.getParamsList(this.listparam);
          }
        });
    }
    this.sidenav.close();
  }

  createComponent(menus) {
    this.container.clear();
    const factory: ComponentFactory<SetAuthorityComponent> = this.resolver.resolveComponentFactory(SetAuthorityComponent);
    this.setAuthorityComponent = this.container.createComponent(factory);
  }

  ngOnDestroy(): void {
    this.routerSubscribe.unsubscribe();
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
    this.valueChange = fn;
  }

  registerOnTouched(fn: any): void {

  }


}


// @Component({
//   selector: "form-unit",
//   templateUrl: "./formunit.component.html",
//   styleUrls: ["./formunit.component.scss"]
// })

// export class FormUnitComponent {

//   @Input() DOMS;
//   @Input() DOMSData;
//   @Input()
//   set selectRow(value) {
//     console.log(value);
//     this._selectRow = value;
//   }
//   get selectRow() {
//     return this._selectRow;
//   }

//   @Input() bindDataJson;

//   @Output() changes: EventEmitter<any> = new EventEmitter();

//   tags = [];
//   _selectRow; //修改数据内容

//   constructor(private toastService: ToastService) { }

//   submitMethod($event) {
//     for (let key in $event) {
//       if ($event[key]) {
//         this.selectRow[key] = $event[key];
//         if (this.selectRow["_" + key] && key !== "logo") {
//           this.selectRow["_" + key] = null;
//         }
//       }
//     }
//     $event.id = this.selectRow.id;
//     this.changes.emit($event);
//   }

//   /**
//    * 选择文件
//    */
//   selected($event) {
//     console.log($event.queue[0]);
//   }

//   /**
//    * 上传完成
//    */
//   uploaded($event) {
//     if ($event.isUploaded) {
//       this.toastService.creatNewMessage("上传成功");
//     }
//   }

//   /**
//    * 添加标签
//    */
//   chipsChange($event) {
//     console.log($event);
//     this.tags = $event;
//   }


// }
