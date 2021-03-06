import { Component, OnInit, Input, ViewContainerRef, EventEmitter, Output } from "@angular/core";
import { OrderService } from "app/services/order/order.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { FormBuilder } from "@angular/forms";

import { ToastService } from "../../component/toast/toast.service";
import { TdLoadingService, TdDialogService } from "@covalent/core";
import { BaseUIComponent } from "../../pages/baseUI.component";
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: "free-application",
  templateUrl: "./application.component.html",
  styleUrls: ["./application.component.scss"],
  providers: [OrderService, TdLoadingService],
  animations: [
    trigger("selectState", [
      state("attachmentsDisplay", style({})),
      transition(":enter", [
        style({
          transform: "translate(80px, 80px)"  //从下面进入
        }), animate(".4s cubic-bezier(.25,.8,.25,1)")
      ])
    ])
  ],
})
export class ApplicationComponent extends BaseUIComponent implements OnInit {

  loanInfo: any; //贷款信息
  attachmentsDisplay: false; //展现附件组下面的附件项
  uploadUrl: string = "/api/LoanOrder/UploadAttachmentFile"; //附件上传地址
  master: string = "/api/LoanOrder/UploadAttachmentFile";
  firstAttachmentActive: boolean = true;  //第一次附件组默认选中样式
  // applicationForm: FormGroup;   //资料收集表单;
  applicationForm: any;
  applyFormData: any;           //动态表单数据
  areaCities: any; //市级数据
  areaCounties: any; //区县级数据
  applyFormPostData: any = null; //用于提交的动态表单数据

  @Input() id: string;
  @Input() status: string;  //用于区分当前侧滑状态
  @Output() closeRefreshData = new EventEmitter();
  manualVerificationForm: boolean = false;  //手动验证动态表单
  errData: any;
  submitParams: any;  //记录提交按钮的数据
  errDataSuccess: any = [];

  loanInfoApplyFormData: any;
  loanInfoApplyFormDataStatus: string;

  constructor(private orderService: OrderService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef,
    private loadingService: TdLoadingService,
    private routerInfor: ActivatedRoute) {
    super(loadingService, routerInfor);
  }

  ngOnInit() {
    // this.applicationForm = this.fb.group({
    //   id:"5a5e1f3eff776332740bf282",              //订单唯一标识
    //   applyAmount: [", Validators.required],     //申请金额
    //   applyTerm: [", Validators.required],       //申请期限
    //   applyAdCode: [", Validators.required],     //申请地区
    //   purpose: [", Validators.required],         //贷款用途
    //   applyFormData: ",   //申请表（表单模版数据）
    // })
    this.loadingService.register("loading");
    this.orderService.getLoanInfo(this.id).subscribe(res => {
      this.loadingService.resolve("loading");
      if (res.data) {
        // console.log(res)
        this.getLoanInfo(res.data);
      }
    })
  }

  //贷款信息
  getLoanInfo(res) {
    this.loanInfo = res;
    this.loanInfo.applyTerm = this.loanInfo.applyTerm.toString();  // 后台返回的类型是number，option里面的value是string
  }

  //点击单个附件项的时候，传递当前附件项数据  （切换附件项）
  displayAttachmentData(attachment, attachmentGroup, index) {
    // console.log(attachment)
    attachmentGroup.temporaryData = attachment;  //临时存储数据
    if (index == 0) {
      this.firstAttachmentActive = !this.firstAttachmentActive;
    } else {
      this.firstAttachmentActive = false;
    }
  }

  //展示一个附件组下的所有附件项   （切换附件组件）
  displayAttachmentGroup(val, attachmentGroup, attachmentGroups, index) {
    //每次切换附件组，下面的附件项都要回到初始状态
    attachmentGroup.temporaryData = "";
    this.firstAttachmentActive = true;

    //每次切换，展示当前附件组下面的附件项
    if (attachmentGroup.attachmentsDisplay === undefined) {
      attachmentGroup.attachmentsDisplay = true;
    } else {
      attachmentGroup.attachmentsDisplay = !attachmentGroup.attachmentsDisplay;
    }

    //每次切换，隐藏其它附件组下面的附件项
    attachmentGroups.forEach((item, i) => {
      if (i !== index) {
        item.attachmentsDisplay = false;
      }
    });

  }

  //附件组和附件项的 状态样式
  statusStyle(status) {
    let color;
    color = (status == "通过" ? "#1aae88" : (status == "待审核" ? "#177bbb" : (status == "待填写" ? "#fbb23e" : "#e33244")));
    return color;
  }


  //接收来自 上传组件 上传的最新文件数据。  更新当前组件的数据
  onPostFileData($event, i, k) {
    let data = this.loanInfo._attachmentGroups;
    // console.log($event)
    data.forEach((item1, index1) => {
      if (index1 == i) {
        item1._attachments.forEach((item2, index2) => {

          if (item2 == k) {
            let res = item2._files;

            if ($event._files) {  //添加附件
              if (res) {
                item2._files = res.concat($event._files[0]);
              } else {
                item2._files = [];
                item2._files[0] = $event._files[0];
              }
            }

            item2._status = this.stausCodeLabel($event._status);
          }
        });
        item1._status = this.stausCodeLabel($event.groupStatus);
      }
    })
  }

  //根据状态码，修改状态label
  stausCodeLabel(code) {
    let label;
    switch (code) {
      case "LoanOrderAttachmentStatus.Audit": label = "待审核"; break;
      case "LoanOrderAttachmentStatus.Uncommitted": label = "待填写"; break;
      case "LoanOrderAttachmentStatus.NotPass": label = "不通过"; break;
      case "LoanOrderAttachmentStatus.Adopt": label = "通过"; break;
    }
    return label;
  }

  //设置附件组(reuiqed字段)是否显示必填。  
  setAttachmentGroupAttachmentRequired(attachmentGroupIndex) {
    // 如果该附件组，下面附件项有一项为必填，则为必填
    // 在没有点击附件组，之前是没有获取附属附件项数据的。 所以手动遍历
    let data = this.loanInfo._attachmentGroups;
    let BreakException = {};
    try {
      data.forEach((item1, index1) => {
        if (index1 == attachmentGroupIndex) {
          item1._attachments.forEach((item2, index2) => {
            if (item2.required && item2.needCount > 0) {
              throw BreakException;
            }
          })
        }
      })
    } catch (e) {
      return true;
    }
    return false;
  }

  //动态表单数据（新增状态下）
  onSubmitParamsNew($event) {
    this.loanInfoApplyFormData = $event;
    this.loanInfoApplyFormDataStatus = 'new';
  }

  //动态表单数据(修改状态下)
  onSubmitParamsEdit($event) {
    this.loanInfo.applyFormData = $event;
    this.loanInfoApplyFormDataStatus = 'edit';
  }

  //接收动态模板的验证信息 
  resiveErroeData(errData, templateState) {
    let errDataSuccess = this.errDataSuccess;
    //验证静态表单
    //验证动态表单

    setTimeout(() => {
      if (this.loanInfo.applyAdCode) {
        errData['applyAdCode'] = "";
      }

      for (let i in errData) {
        if (errData[i]) {
          super.openAlert({ title: "提示", message: '请填写完整相关信息', dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
          this.manualVerificationForm = false;
          return false;   //如果有错误，则停止提交
        }
      }

      if (errDataSuccess.indexOf(templateState) == -1) {
        errDataSuccess.push(templateState);
      }
      if (errDataSuccess.length !== 2) { return false };  //只有静态模板和动态模板都通过的时候，才能继续提交。


      //验证附件 
      if (!this.multipleFileUploaderLowerLimit()) {
        setTimeout(() => {
          this.manualVerificationForm = false;
        }, 0)
        return false;
      };

      //可以提交
      this.onSubmitPostData();
    }, 0)
  }

  //提交申请
  onSubmit($event, url, label, status) {
    this.submitParams = { url: url, label: label };
    if (status == "Audit") {    //点击提交的时候才做附件验证，点击暂存的时候不需要验证
      this.manualVerificationForm = true;
    } else {
      this.onSubmitPostData();  //直接提交
    }
  }

  onSubmitPostData() {

    let _self = this;
    let submitParams = this.submitParams;
    let loanInfoApplyFormDataStatus = this.loanInfoApplyFormDataStatus;
    this.applicationForm = {
      id: this.id,              //订单唯一标识
      applyAmount: this.loanInfo.applyAmount,     //申请金额
      applyTerm: this.loanInfo.applyTerm,       //申请期限
      applyAdCode: this.loanInfo.applyAdCode,     //申请地区
      purpose: this.loanInfo.purpose,         //贷款用途
      applyFormData: loanInfoApplyFormDataStatus == 'new' ? this.loanInfoApplyFormData : this.loanInfo.applyFormData       //申请表（表单模版数据）
    };
    // console.log(this.applicationForm);
    this.loadingService.register("loading");
    this.orderService.onSubmitComplementaryData(submitParams['url'], this.applicationForm).subscribe(res => {
      if (res.code === "0") {
        super.showToast(_self.toastService, submitParams['label'] + "成功");
        _self.closeRefreshData.emit();
      } else {
        super.openAlert({ title: "提示", message: res.message, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
      }
      _self.loadingService.resolve("loading");
      setTimeout(() => {
        _self.manualVerificationForm = false;
      }, 0)
    }, (err) => {
      super.openAlert({ title: "提示", message: err, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
      _self.loadingService.resolve("loading");
      setTimeout(() => {
        _self.manualVerificationForm = false;
      }, 0)
    })

  }

  //根据多文件上传，上传最小数量的限制  和 是否有'不通过'的状态。 来判断是否可以继续提交 
  multipleFileUploaderLowerLimit() {
    let attachmentGroups = this.loanInfo._attachmentGroups;
    let BreakException = {};
    try {
      attachmentGroups.forEach((element, index) => {
        let attachments = element['_attachments'];
        attachments.forEach((element1, index1) => {
          let currentNum = element1['_files'] ? element1['_files'].length : 0;
          let lowerLimit = element1['needCount'];

          //当前附件项下,当前文件的数量 < 规定上传的数量,禁止提交
          // 是否有不通过状态,如果有则禁止提交(针对补资料页面)（资料收集页面没有不通过状态）
          if (currentNum < lowerLimit || element1['_status'] == '不通过') {
            //提示 
            let msg;
            if (currentNum < lowerLimit) {
              msg = "附件项\"" + element1['name'] + "\"最少上传" + element1['needCount'] + "个文件";
            } else {
              msg = "附件项\"" + element1['name'] + "\"有不通过项";
            }

            super.openAlert({ title: "提示", message: msg, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
            //展开该附件组
            element.attachmentsDisplay = true;
            //,关闭其他附件组
            attachmentGroups.forEach((e, i) => {
              if (i !== index) {
                e.attachmentsDisplay = false;
              }
            })
            //展开该附件项
            if (index1 == 0) {
              this.firstAttachmentActive = true;
            } else {
              this.firstAttachmentActive = false;
            }
            element.temporaryData = element1;
            //停止继续提交
            throw BreakException;
          }

        });
      });
    } catch (e) {
      return false;   //不能继续提交了
    }
    return true;  //可以继续提交
  }

}
