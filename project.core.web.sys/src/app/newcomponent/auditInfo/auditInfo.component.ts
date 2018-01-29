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
  // applicationForm: FormGroup;   //资料收集表单;
  applicationForm: any;
  applyFormData: any;           //动态表单数据
  areaCities: any; //市级数据
  areaCounties: any; //区县级数据
  applyFormPostData: any; //用于提交的动态表单数据

  readyOnly: boolean = true;  //贷款信息是否是只读

  @Input() id: string;

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

  //提交申请
  onSubmit(url, label) {
    let _self = this;
    let id = this.id;
    super.openPrompt({ message: "请输入备注", dialogService: this.dialogService, viewContainerRef: this.viewContainerRef }, function (val: string) {
      if (val) {
        _self.orderService.onSubmitAuditData(url, id, val).subscribe(res => {
          if (res.code === "0") {
            // super.showToast(_self.toastService, label + "成功");
            _self.toastService.creatNewMessage({ message: label + "成功" });
          } else {
            _self.toastService.creatNewMessage({ message: res.message });
          }
        })
      }
    })
  }

}

