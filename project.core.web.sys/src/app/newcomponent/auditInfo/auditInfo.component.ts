import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from "app/services/order/order.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { forEach } from '@angular/router/src/utils/collection';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { TimiSelectModule } from "../../component/timi-select/select.component";
import { TimiInputModule } from "../../component/timi-input/timi-input.component";
import { ToastService } from "../../component/toast/toast.service";
import { TdLoadingService } from "@covalent/core";
import { BaseUIComponent } from "../../pages/baseUI.component";

@Component({
  selector: 'free-auditInfo',
  templateUrl: './auditInfo.component.html',
  styleUrls: ['./auditInfo.component.scss'],
  providers: [OrderService],
  animations: [
    trigger('selectState', [
      state('attachmentsDisplay', style({})),
      transition(':enter', [
        style({
          transform: 'translate(0, 80px)'  //从下面进入
        }), animate('.4s cubic-bezier(.25,.8,.25,1)')
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

  constructor(private orderService: OrderService, private fb: FormBuilder, private toastService: ToastService, private loadingService: TdLoadingService) {
    super(loadingService);
  }

  ngOnInit() {
    // this.applicationForm = this.fb.group({
    //   id:'5a5e1f3eff776332740bf282',              //订单唯一标识
    //   applyAmount: ['', Validators.required],     //申请金额
    //   applyTerm: ['', Validators.required],       //申请期限
    //   applyAdCode: ['', Validators.required],     //申请地区
    //   purpose: ['', Validators.required],         //贷款用途
    //   applyFormData: '',   //申请表（表单模版数据）
    // })

    this.orderService.getLoanOrderDetail(this.id).subscribe(res => {
      if (res.data) {
        console.log(res)
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
    color = (status == '通过' ? '#1aae88' : (status == '待审核' ? '#177bbb' : (status == '待填写' ? '#fbb23e' : '#e33244')));
    return color;
  }


  //接收来自 上传组件 上传的最新文件数据。  更新当前组件的数据
  onPostFileData($event, i, k) {
    let data = this.loanInfo._attachmentGroups;
    data.forEach((item1, index1) => {
      if (index1 == i) {
        item1._attachments.forEach((item2, index2) => {
          // console.log(item2)
          if (item2 == k) {
            let res = item2._files;
            if (res) {
              item2._files = res.concat($event);
            } else {
              item2._files = $event;
            }
          }
        })
      }
    })
  }



  //动态表单数据
  onSubmitParams($event) {
    // console.log($event);
    this.applyFormPostData = $event;
  }

  //提交申请
  onSubmit($event) {
    let _self = this;
    this.applicationForm = {
      id: this.id,              //订单唯一标识
      applyAmount: this.loanInfo.applyAmount,     //申请金额
      applyTerm: this.loanInfo.applyTerm,       //申请期限
      applyAdCode: this.loanInfo.applyAdCode,     //申请地区
      purpose: this.loanInfo.purpose,         //贷款用途
      applyFormData: this.applyFormPostData,   //申请表（表单模版数据）
    }
    // console.log(this.applicationForm)
    this.orderService.onSubmitComplementaryData(this.applicationForm).subscribe(res => {
      if (res.code === "0") {
        // console.log(res)
        // _self.toastService.creatNewMessage("申请成功");
        super.showToast(_self.toastService, "申请成功");
      } else {
        // _self.toastService.creatNewMessage(res.message);
        super.showToast(_self.toastService, res.message);
      }
    })
  }

  //审核附件组和附件项
  //通过 
  postLoanOrderAdoptAttachment(id) {
    let _self = this;
    this.orderService.postLoanOrderAdoptAttachment(id).subscribe(res => {
      if (res.code === "0") {
        console.log(res)
        super.showToast(_self.toastService, "已通过");
        // _self.toastService.creatNewMessage("申请成功");
      } else {
        super.showToast(_self.toastService, res.message);
      }
    })
  }

  // //不通过 
  // postLoanOrderNotPassAttachment(id, statusRemark) {
  //   return this.baseService.post("/api/LoanOrder/NotPassAttachment", {
  //     id: id,
  //     statusRemark: statusRemark
  //   });
  // }
}
