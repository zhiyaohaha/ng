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

  // 审核(初/复审) /终审/待放款 -------(默认情况)--------只读（不传不删）,可审

  // 面签，放款--------1)其它附件(默认情况)-----只读（不传不删），可审
  //2)指定附件-----非只读（可传可删除）,不可审。 

  loanInfo: any; //贷款信息
  attachmentsDisplay: false; //展现附件组下面的附件项
  firstAttachmentActive: boolean = true;  //第一次附件组默认选中样式

  readyOnly: boolean = true;  //贷款信息是否是只读

  approveLoanInfoForm: any;   //批核/放款---信息表单
  approveLoanInfoFormDislayLabel: string = '批核';  // 展示批核/放款的label
  auditStatus: string;   //审核状态
  aduitOption: string; //审核选项
  auditResultReason: any;  //审核状态原因
  process: string; //流程
  auditResultPass: boolean = false;  //审核是否通过(审核选择通过以后,才显示批核选项)

  //临时数据代码
  //还款方式 
  termBindData: any = [
    { text: "吃饭", value: "11", childrens: null },
    { text: "睡觉", value: "12", childrens: null }
  ]

  @Input() id: string;
  @Input() status: string;  //用于区分当前侧滑状态

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
        this.process = res.data.process;
        this.getLoanInfo(res.data);
      }
    })

    // 初审/复审/终审/面签/待放款
    if (this.status == 'auditFirstRecheck' || this.status == 'auditFinal' || this.status == 'interview' || this.status == 'waitLoan' || this.status == 'loan') {
      this.approveLoanInfoForm = this.fb.group({
        loanApprovedAmount: [''],                            //批贷金额
        loanApprovedDeadline: [''],                          //批贷期限
        loanApprovedYearsRate: [''],                         //批贷年化
        loanApprovedMonthsRate: [''],                        //批贷月费率
        loanApprovedRepaymentMethod: [''],                   // 批贷还款方式
        loanTime1: '',                               //放款时间 
        loanTime2: ''
      })

      if (this.status == 'waitLoan') {
        this.approveLoanInfoFormDislayLabel = '放款';
      }
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
  setAuidtResult(auditOption) {
    let process = this.process;
    this.auditStatus = auditOption.status;
    this.aduitOption = auditOption.option;

    //是否显示批核表单 
    if (auditOption.name == '通过') {
      this.auditResultPass = true;
    } else {
      this.auditResultPass = false;
    }

    //根据不同的状态，请求不同的原因 
    this.loadingService.register("loading");
    this.orderService.GetAuditOpinion(process, auditOption.status, auditOption.option).subscribe(res => {
      if (res.code == "0") {
        // this.auditResultReason = res.data
        // { label: '我们同意', status: false }
        let auditResultReason = [];
        res.data.forEach(element => {
          auditResultReason.push({ label: element, status: false })
        });
        this.auditResultReason = auditResultReason;
        this.loadingService.resolve("loading");
      }
    })
  }

  //添加，审核结果原因
  chipsChange(e) {
    let process = this.process;
    let content = e[0]['label'];
    let aduitOption = this.aduitOption;
    let auditStatus = this.auditStatus;
    let _self = this;

    this.loadingService.register("loading");
    this.orderService.PostAddAuditOpinion(process, auditStatus, aduitOption, content).subscribe(res => {
      this.loadingService.resolve("loading");
      if (res.code == "0") {
        super.showToast(_self.toastService, "添加成功");
      } else {
        super.openAlert({ title: "提示", message: "提交失败", dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
      }
    })

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


  //提交申请
  onSubmit(url, label) {
    // console.log(this.approveLoanInfoForm.value)  //批准表单
    // console.log(this.auditStatus)  //审核状态
    // console.log(this.aduitOption)  //审核选项
    // console.log(this.auditResultReason) //审核结果原因集合
    // console.log(url)

    let postData = {}
    let _self = this;
    let id = this.id;
    let _status = this.status;

    if (_status == 'auditFirstRecheck') {  //(初审/复审)
      let aduitOption = this.aduitOption;
      let auditStatus = this.auditStatus;

      //审核结果 
      let auditResultReason = this.auditResultReason;
      let auditContent = [];
      auditResultReason.forEach(element => {
        if (element.status) {
          auditContent.push(element.label);
        }
      });

      //批核表单
      let approveLoanInfoForm = this.approveLoanInfoForm.value;
      let approveLoanInfoFormAttrs = {};
      let attrKeys = ['金额', '期限', '年化', '月费率', '还款方式'];
      let attrValues = ['loanApprovedAmount', 'loanApprovedDeadline', 'loanApprovedYearsRate', 'loanApprovedMonthsRate', 'loanApprovedRepaymentMethod'];
      for (let i in attrKeys) {
        if (attrKeys[i] == "年化" || attrKeys[i] == "月费率") {
          approveLoanInfoFormAttrs["\"" + this.approveLoanInfoFormDislayLabel + attrKeys[i] + "\""] = (approveLoanInfoForm[attrValues[i]] / 100);
        } else {
          approveLoanInfoFormAttrs["\"" + this.approveLoanInfoFormDislayLabel + attrKeys[i] + "\""] = approveLoanInfoForm[attrValues[i]];
        }
      }

      postData = {
        id: id,
        status: auditStatus,
        description: auditContent,
        option: aduitOption,
        attrs: approveLoanInfoFormAttrs
      };
    }
    // console.log( postData)
    _self.orderService.onSubmitAuditData(url, postData).subscribe(res => {
      if (res.code === "0") {
        _self.toastService.creatNewMessage({ message: label + "成功" });
      } else {
        super.openAlert({ title: "提示", message: label + "失败,原因是：" + res.message, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
        // _self.toastService.creatNewMessage({ message: res.message });
      }
    }, (err) => {
      super.openAlert({ title: "提示", message: err, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
    })
  }

}

