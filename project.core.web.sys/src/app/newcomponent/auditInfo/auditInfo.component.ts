import { Component, OnInit, Input, ViewContainerRef } from "@angular/core";
import { OrderService } from "app/services/order/order.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { FormBuilder } from "@angular/forms";

import { ToastService } from "../../component/toast/toast.service";
import { TdLoadingService, TdDialogService } from "@covalent/core";
import { BaseUIComponent } from "../../pages/baseUI.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "free-auditInfo",
  templateUrl: "./auditInfo.component.html",
  styleUrls: ["./auditInfo.component.scss"],
  providers: [OrderService],
  animations: [
    trigger("selectState", [
      state("attachmentsDisplay", style({})),
      transition(":enter", [
        style({
          transform: "translate(0, 80px)"  //从下面进入
        }), animate(".4s cubic-bezier(.25,.8,.25,1)")
      ])
    ])
  ],
})
export class AuditInfoComponent extends BaseUIComponent implements OnInit {

  loanInfo: any; //贷款信息
  attachmentsDisplay: false; //展现附件组下面的附件项
  uploadUrl: string = "/api/LoanOrder/UploadAttachmentFile"; //附件上传地址
  master: string = "/api/LoanOrder/UploadAttachmentFile";
  firstAttachmentActive: boolean = true;  //第一次附件组默认选中样式

  applyFormData: any;           //动态表单数据
  areaCities: any; //市级数据
  areaCounties: any; //区县级数据
  applyFormPostData: any; //用于提交的动态表单数据

  readyOnly: boolean = true;  //贷款信息是否是只读

  waitLoanForm: any;
  approveInfoForm: any;   //批核信息表单
  auditResultForm: any;   //审核结果表单
  auditResultReason: any;  //审核结果原因
  auditResultPass: boolean = false;  //审核通过
  //临时数据代码
  //还款方式 
  termBindData: any = [
    { text: "吃饭", value: "11", childrens: null },
    { text: "睡觉", value: "12", childrens: null }
  ]
  //通过与不通过原因 
  // terms2: any = ['我们不同意', "心情不好", "饿了", "还行", "随意", "就这样吧"];
  // terms1: any = ['我们同意', "心情好", "还行", "随意", "就这样吧", "随缘吧"];
  terms2: any = [{ label: '我们不同意', status: false }, { label: "心情不好", status: true }, { label: "饿了", status: false }, { label: "还行", status: false }, { label: "随意", status: false }, { label: "就这样吧", status: true }];
  terms1: any = [{ label: '我们同意', status: false }, { label: "心情好", status: false }, { label: "还行", status: true }, { label: "随意", status: false }, { label: "就这样吧", status: false }, { label: "随缘吧", status: true }];

  @Input() id: string;
  @Input() status: string;  //用于区分资料补充/待放款

  constructor(private orderService: OrderService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef,
    private routerInfor: ActivatedRoute) {
    super(loadingService, routerInfor);
  }

  ngOnInit() {
    this.loadingService.register("loading");
    this.orderService.getLoanOrderDetail(this.id).subscribe(res => {
      this.loadingService.resolve("loading");
      if (res.data) {
        // console.log(res)
        this.getLoanInfo(res.data);
      }
    })

    if (this.status == 'auditFirstRecheck') {  // 初审/复审,
      this.auditResultForm = this.fb.group({
        res1: '',                            //审核结果
        res2: [''],                          //审核原因
      })
      this.approveInfoForm = this.fb.group({
        loanApprovedAmount: [''],                            //批贷金额
        loanApprovedTerm: [''],                              //  批贷期限
        loanApprovedRepaymentMethod: [''],                   // 批贷还款方式
      })
    }

    if (this.status == 'waitLoan') {  //待放款
      this.waitLoanForm = this.fb.group({
        loanApprovedAmount: [''],                            //批贷金额
        loanApprovedTerm: [''],                              //  批贷期限
        loanApprovedRepaymentMethod: [''],                   // 批贷还款方式
      })
    }
  }

  //贷款信息
  getLoanInfo(res) {
    this.loanInfo = res;
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


  //审核附件组和附件项
  //通过
  postLoanOrderAdoptAttachment(id, i, k) {
    let _self = this;
    this.loadingService.register("loading");
    this.orderService.postLoanOrderAdoptAttachment(id).subscribe(res => {
      _self.loadingService.resolve("loading");
      if (res.code === "0") {
        console.log(res);
        _self.setStatus(i, k, res.data, "");
        super.showToast(_self.toastService, "已通过");
        // _self.toastService.creatNewMessage("申请成功");
      } else {
        super.showToast(_self.toastService, res.message);
      }
    })
  }

  //不通过
  postLoanOrderNotPassAttachment(id, i, k) {
    let _self = this;
    this.loadingService.register("loading");
    super.openPrompt({ message: "请输入不通过原因", dialogService: this.dialogService, viewContainerRef: this.viewContainerRef }, function (val: string) {
      _self.loadingService.resolve("loading");
      if (val) {
        _self.orderService.postLoanOrderNotPassAttachment(id, val).subscribe(res => {
          if (res.code === "0") {
            // super.showToast(_self.toastService, "已通过");
            _self.setStatus(i, k, res.data, val);
            _self.toastService.creatNewMessage({ message: "已拒绝" });
          } else {
            _self.toastService.creatNewMessage({ message: res.message });
          }
        })
      }
    })
  }

  //根据审核结果修改 当前附件项/组状态。
  setStatus(i, k, resData, NotPassReason) {
    let data = this.loanInfo._attachmentGroups;
    data.forEach((item1, index1) => {
      if (index1 == i) {
        item1._attachments.forEach((item2, index2) => {
          if (item2 == k) {
            item2._status = this.stausCodeLabel(resData._status);
            if (NotPassReason) {  //不通过状态
              // console.log(NotPassReason)
              item2.statusRemark = NotPassReason;
            }
          }
        });
        item1._status = this.stausCodeLabel(resData.groupStatus);
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

  //根据审核结果的不同，显示不同结果的原因 
  setAuidtResult($event) {
    if ($event.value == '通过') {
      this.auditResultReason = this.terms1;
      this.auditResultPass = true;
    } else if ($event.value == '不通过') {
      this.auditResultReason = this.terms2;
      this.auditResultPass = false;
    }
  }

  //提交申请
  onSubmit(url, label) {
    // console.log(this.approveInfoForm.value)  //批准表单
    console.log(this.auditResultForm.value)  //审核结果
    console.log(this.auditResultReason) //审核结果原因

    // let _self = this;
    // let id = this.id;
    // let _status = this.status;
    // let postData = {};
    // super.openPrompt({ message: "请输入备注", dialogService: this.dialogService, viewContainerRef: this.viewContainerRef }, function (val: string) {
    //   if (val) {
    //     if (_status == 'audit') {  //资料审核
    //       postData = {
    //         id: id,
    //         description: val
    //       };
    //     } else if (_status == 'waitLoan') {  //待放款
    //       postData = {
    //         id: id,
    //         description: val,
    //         loanApprovedAmount: _self.waitLoanForm.value.loanApprovedAmount,   //批贷金额
    //         loanApprovedTerm: _self.waitLoanForm.value.loanApprovedTerm,   //  批贷期限
    //         loanApprovedRepaymentMethod: _self.waitLoanForm.value.loanApprovedRepaymentMethod,   //    批贷还款方式
    //       };
    //     }
    //     // console.log(postData)
    //     _self.orderService.onSubmitAuditData(url, postData).subscribe(res => {
    //       if (res.code === "0") {
    //         // super.showToast(_self.toastService, label + "成功");
    //         _self.toastService.creatNewMessage({ message: label + "成功" });
    //       } else {
    //         _self.toastService.creatNewMessage({ message: res.message });
    //       }
    //     })
    //   }
    // })
  }

}

