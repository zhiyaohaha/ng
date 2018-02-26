import {Component, OnInit} from "@angular/core";
import {TdLoadingService} from "@covalent/core";
import {ActivatedRoute} from "@angular/router";
import {PostLoanManagementService} from "../../../services/post-loan-management/post-loan-management.service";
import {FnUtil} from "../../../common/fn-util";
import {BaseUIComponent} from "../../baseUI.component";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../component/toast/toast.service";
import {ConvertUtil} from "../../../common/convert-util";
import {FileUploader} from "ng2-file-upload";
import {PreviewService} from "../../../services/preview/preview.service";

export class FileLists {
  id: string;
  path: string;
}

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

  sidenavKey: string; // Detail 详细 CreatePlan 生成还款计划  Repayment 还款
  repaymentTypes; // 还款类型
  repaymentWay; // 还款方式
  orgId; // 公司ID

  orderDetail; // 订单基本信息
  repaymentPlan; // 还款计划
  rowId; // 点击行存下的ID
  repaymentId; // 还款的ID

  inputData; // 上传凭证
  repaymentForm: FormGroup; // 还款表单
  repaymentPlanForm: FormGroup; // 还款计划表单

  totalLoanApprovedAmount = 0; // 总应还金额
  totalActualAmount = 0; // 总实际还款金额

  fileLists: FileLists[] = []; // 图片列表的数组
  uploader: FileUploader; // 上传的对象
  paymentInformation; // 还款信息

  pagecode: string;


  constructor(private fb: FormBuilder,
              private loading: TdLoadingService,
              private toastService: ToastService,
              private activatedRoute: ActivatedRoute,
              private postLoanManagementService: PostLoanManagementService,
              private fnUtil: FnUtil,
              private convertUtil: ConvertUtil,
              private previewService: PreviewService) {
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
    this.repaymentWay = [{
      text: "先息后本",
      value: "a4debcad58b8ebcd02739df",
      childrens: null
    }];

    this.orgId = this.activatedRoute.snapshot.paramMap.get("orgId");

    this.pagecode = this.fnUtil.getPageCode();
    let paginationInfo = this.fnUtil.getPaginationInfo();
    this.pageSize = paginationInfo.pageSize;
    this.currentPage = paginationInfo.currentPage;

    this.listparam.index = this.currentPage;
    this.listparam.size = this.pageSize;
    if (this.orgId) {
      this.listparam.filter = this.convertUtil.toJsonStr({orgId: this.orgId});
    }

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
        this.datas = res.data.lending;
        this.totals = res.data.total;
        this.totalLoanApprovedAmount = res.data.totalLoanApprovedAmount;
        this.totalActualAmount = res.data.totalActualAmount;
      }
    });
  }

  /**
   * 搜索
   * @param $event
   */
  onSearch($event) {
    this.listparam.index = 0;
    if (this.orgId) {
      let obj = this.convertUtil.toJSON($event);
      obj["orgId"] = this.orgId;
      this.listparam.filter = this.convertUtil.toJsonStr(obj);
    } else {
      this.listparam.filter = $event;
    }
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
      name: "orgName.name",
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
      name: "loanApprovedAmount",
      pipe: ""
    }, {
      hidden: false,
      label: "年化",
      name: "loanYearRate",
      pipe: ""
    }, {
      hidden: false,
      label: "放款时间",
      name: "loanDate",
      pipe: "HtmlPipe.DateTime"
    }, {
      hidden: false,
      label: "还款方式",
      name: "_loanApprovedRepaymentMethod",
      pipe: ""
    }, {
      hidden: false,
      label: "期数",
      name: "loanApprovedTerm",
      pipe: ""
    }, {
      hidden: false,
      label: "已还期数",
      name: "numberOfReturns",
      pipe: ""
    }, {
      hidden: false,
      label: "逾期数",
      name: "overdueNumber",
      pipe: ""
    }, {
      hidden: false,
      label: "已还金额",
      name: "amountReturned",
      pipe: ""
    }, {
      hidden: false,
      label: "上次还款时间",
      name: "lastRepaymentDate",
      pipe: ""
    }, {
      hidden: false,
      label: "下次应还时间",
      name: "nextRepaymentDate",
      pipe: ""
    }];
  }

  /**
   * 点击表格的行执行的事件
   * @param $event
   */
  rowClickEvent($event) {
    this.sidenavKey = "Detail";
    this.rowId = $event.id;
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
        this.orderDetail = res.data[0];
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

  /**
   * 点击还款
   * @param $event
   */
  onClickRepayment($event) {
    if ($event === "all") {
      this.sidenavKey = "AllRepayment";
      this.repaymentId = "";
      this.repaymentForm = this.fb.group({
        order: [this.rowId],
        ActualTime: ["", Validators.required],
        ActualAmount: ["", Validators.required],
        ActualLateFee: ["", Validators.required],
        RepaymentWay: ["", Validators.required],
        PaymentVoucher: [null, Validators.required],
        Remark: ["", Validators.required]
      });
    } else {
      this.sidenavKey = "Repayment";
      this.repaymentId = $event.id;
      this.fileLists = $event._paymentVoucher && $event._paymentVoucher.map(item => {
        return {id: item.id, path: item.path};
      }); // 上传凭证
      this.inputData = JSON.parse(JSON.stringify(this.fileLists));
      this.repaymentForm = this.fb.group({
        id: [this.repaymentId],
        ActualTime: [$event.actualTime, Validators.required],
        ActualAmount: [$event.actualAmount, Validators.required],
        ActualLateFee: [$event.actualLateFee, Validators.required],
        RepaymentWay: [$event.repaymentWay, Validators.required],
        PaymentVoucher: [this.inputData, Validators.required],
        Remark: [$event.remark]
      });
    }
    // 还款表单
    console.log($event);

  }

  /**
   * 还款计划表
   */
  createPlan() {
    this.sidenavKey = "CreatePlan";
    // 还款计划表单
    this.repaymentPlanForm = this.fb.group({
      order: [this.rowId],
      loanTime: ["", Validators.required],
      yearRate: ["", Validators.required],
      monthRate: ["", Validators.required],
      repaymentType: ["a4debcad58b8ebcd02739df", Validators.required]
    });
  }

  /**
   * 返回详细
   */
  onClickBack() {
    this.sidenavKey = "Detail";
    // this.getOrderDetail(this.rowId);
    this.getRepaymentPlan(this.rowId);
  }

  /**
   * 确定还款
   */
  submitRepayment() {

    // 校验输入值
    for (const i in this.repaymentForm.controls) {
      if (this.repaymentForm.controls[i]) {
        this.repaymentForm.controls[i].markAsDirty();
      }
    }

    if (this.repaymentForm.valid) {
      this.loading.register("loading");
      this.postLoanManagementService.submitRepayment(this.repaymentForm.value)
        .subscribe(res => {
          this.loading.resolve("loading");
          super.showToast(this.toastService, res.message || "状态未知");
          if (res.code === "0") {
            this.sidenavKey = "Detail";
            this.getRepaymentPlan(this.rowId);
          }
        });
    }
  }

  /**
   * 全额还款
   */
  submitAllRepayment() {
    // 校验输入值
    for (const i in this.repaymentForm.controls) {
      if (this.repaymentForm.controls[i]) {
        this.repaymentForm.controls[i].markAsDirty();
      }
    }

    if (this.repaymentForm.valid) {
      this.postLoanManagementService.submitAllRepayment(this.repaymentForm.value)
        .subscribe(res => {
          this.loading.resolve("loading");
          super.showToast(this.toastService, res.message || "状态未知");
          if (res.code === "0") {
            this.sidenavKey = "Detail";
            this.getRepaymentPlan(this.rowId);
          }
        });
    }
  }

  /**
   * 确定生成还款计划
   */
  submitCreatePlan() {
    // 校验输入值
    for (const i in this.repaymentPlanForm.controls) {
      if (this.repaymentPlanForm.controls[i]) {
        this.repaymentPlanForm.controls[i].markAsDirty();
      }
    }

    if (this.repaymentPlanForm.valid) {
      this.loading.register("loading");
      this.postLoanManagementService.submitCreatePlan(this.repaymentPlanForm.value)
        .subscribe(res => {
          this.loading.resolve("loading");
          console.log(res);
        });
    }
  }

  /**
   * 获取表单control
   * @param name
   * @returns {any}
   */
  getFormControl(name): AbstractControl {
    return this.repaymentForm.controls[name];
  }

  onPostFileData($event) {
    console.log($event);
  }

  /**
   * 返回上传对象
   * @param $event
   */
  uploadObj($event) {
    this.uploader = $event;
  }

  /**
   * 移除上传的某一项
   * @param item
   */
  removeItem(item) {
    if (this.fileLists.some(f => f.id === item.id)) {
      this.fileLists = this.fileLists.filter(f => f.id !== item.id);
    } else {
      item.remove();
    }
    this.inputData = JSON.parse(JSON.stringify(this.fileLists));
  }

  /**
   * 日期触发事件
   * @param $event
   * @param type 1 全额还款 2 单笔还款
   */
  onDateChange($event, type) {
    this.getPaymentInformation({order: this.rowId, actualTime: $event.value, isAdvance: type, id: this.repaymentId});
  }

  /**
   * 获取还款信息 本金、滞纳金、违约金、利息
   * @param params
   */
  getPaymentInformation(params) {
    this.postLoanManagementService.getPaymentInformation(params)
      .subscribe(res => {
        if (res.code === "0") {
          this.paymentInformation = res.data;
          this.repaymentForm.patchValue({
            ActualAmount: this.paymentInformation.allMoney,
            ActualLateFee: this.paymentInformation.lateFee
          });
        }
      });
  }


  /**
   * 预览图片
   * @param data
   */
  previewImg(data) {
    let arr = [];
    if (typeof data === "string") {
      arr.push(data);
    } else {
      arr = data.map(item => item.path);
    }
    this.previewService.imgUrls = arr;
    this.previewService.showPreview(true);
  }
}
