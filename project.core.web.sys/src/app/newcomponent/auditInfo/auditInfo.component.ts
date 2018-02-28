import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from "@angular/core";
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
  styleUrls: ["./auditInfo.component.scss", "../../common/directive/validators.directive.scss"],
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
  uploadUrl: string = "/api/LoanOrder/UploadAttachmentFile"; //附件上传地址

  approveLoanInfoForm: any;   //批核/放款---信息表单
  approveLoanInfoFormDislayLabel: string = '批核';  // 展示批核/放款的label
  auditStatus: string;   //审核状态
  aduitOption: string; //审核选项
  auditResultReason: any;  //审核状态原因
  process: string; //流程
  auditResultPass: boolean = false;  //审核是否通过(审核选择通过以后,才显示批核选项)
  assignUsers: any;  //指派人
  org: any;
  auditOptionName: string;  //审核结果名字

  @Input() id: string;
  @Input() status: string;  //用于区分当前侧滑状态
  @Output() closeRefreshData = new EventEmitter();
  @Output() detailClick = new EventEmitter();

  _errData = []; //错误信息集合
  validatorGather: any = [  //验证信息集合
    {
      validatorRequired: true,
      customValidator: [
        { message: "请输入正确的金额", name: "金额", regular: "^(([1-9]\\d{0,9})|0)(\\.\\d{1,4})?$" },
        { message: "请输入数字", name: "只能输入数字", regular: "^\\d+(\\.\\d+)?$" }
      ]
    },
    {
      validatorRequired: true,
      customValidator: []
    },
  ];
  submitVerify: boolean = false;

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

    if (this.status == 'Detail') {
      this.orderService.getLoanDetail(this.id).subscribe(res => {
        this.loadingService.resolve("loading");
        if (res.code == "0") {
          let data = res.data;
          this.getLoanInfo(data);
        } else {
          super.openAlert({ title: "提示", message: res.message, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
        }
      }, err => {
        super.openAlert({ title: "提示", message: err, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
      })
    } else {
      this.orderService.getLoanOrderDetail(this.id, this.status).subscribe(res => {
        this.loadingService.resolve("loading");
        if (res.code == "0") {
          let data = res.data;
          this.process = data.process;
          this.getLoanInfo(data);
          this.org = data.org;
        } else {
          super.openAlert({ title: "提示", message: res.message, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
        }
      })

      // (初/复审/) 终审 待放款
      if (this.status !== 'FaceSign' && this.status !== 'Loan') {
        this.approveLoanInfoForm = this.fb.group({
          loanApprovedAmount: [''],                            //批贷金额
          loanApprovedDeadline: [''],                          //批贷期限
          loanApprovedYearsRate: [''],                         //批贷年化
          loanApprovedMonthsRate: [''],                        //批贷月费率
          loanApprovedRepaymentMethod: [''],                   // 批贷还款方式
          loanApprovedAssignUsers: [''],                       //被指派人
          loanDate: '',                                        //放款日期
          loanTime: ''                                         //放款时间
        })

        if (this.status == 'WaitLoan') {
          this.approveLoanInfoFormDislayLabel = '放款';
        }
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
    super.openPrompt({ message: "请输入不通过原因", dialogService: this.dialogService, viewContainerRef: this.viewContainerRef }, function (val: string) {
      if (val) {
        _self.loadingService.register("loading");
        _self.orderService.postLoanOrderNotPassAttachment(id, val).subscribe(res => {
          if (res.code === "0") {
            // super.showToast(_self.toastService, "已通过");
            _self.setStatus(i, k, res.data, val);
            _self.toastService.creatNewMessage({ message: "已拒绝" });
            _self.loadingService.resolve("loading");
          } else {
            _self.toastService.creatNewMessage({ message: res.message });
            _self.loadingService.resolve("loading");
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

  //根据审核结果的不同，显示不同结果的原因 
  setAuidtResult(auditOption) {
    let process = this.process;
    this.auditStatus = auditOption.status;
    this.aduitOption = auditOption.option;
    this.auditOptionName = auditOption.name;
    //是否显示批核表单 
    if (auditOption.option == 'ProcessNodeAuditOption.Adopt') {
      this.auditResultPass = true;
      let org = this.org;
      if (this.status == 'FinalAudit') {    //只有终审才有指派功能
        this.orderService.GetAssignUsers(org, process, auditOption.status).subscribe(res => {
          if (res.code == "0") {
            this.assignUsers = res.data;
          } else {
            super.openAlert({ title: "提示", message: res.message, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
          }
        })
      }

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
    let content = e[e.length - 1]['label'];
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
  onSubmit(url, label, type) {
    if (type === "HtmlDomCmd.Redirect") {
      let id = this.id;
      this.detailClick.emit({ url: url, id: id });
    } else if (type === "HtmlDomCmd.API") {
      if (!this.multipleFileUploaderLowerLimit()) return false;
      // console.log('可以上传')
      let postData = {}
      let _self = this;
      let id = this.id;
      let _status = this.status;
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

      postData = {
        id: id,
        status: auditStatus,
        description: auditContent,
        option: aduitOption,
      };
      // console.log(postData)
      if (_status !== 'FaceSign') {     //(初审/复审) 终审  待放款 放款
        //批核表单
        let approveLoanInfoForm = this.approveLoanInfoForm.value;
        let approveLoanInfoFormAttrs = {};
        let attrKeys = ['金额', '期限', '年化', '月费率', '还款方式'];
        let attrValues = ['loanApprovedAmount', 'loanApprovedDeadline', 'loanApprovedYearsRate', 'loanApprovedMonthsRate', 'loanApprovedRepaymentMethod'];
        for (let i in attrKeys) {
          if (attrKeys[i] !== "还款方式") {
            if (attrKeys[i] == "年化" || attrKeys[i] == "月费率") {
              approveLoanInfoFormAttrs[this.approveLoanInfoFormDislayLabel + attrKeys[i]] = Number((approveLoanInfoForm[attrValues[i]] / 100));
            } else {
              approveLoanInfoFormAttrs[this.approveLoanInfoFormDislayLabel + attrKeys[i]] = Number(approveLoanInfoForm[attrValues[i]]);
            }
          } else {
            approveLoanInfoFormAttrs[this.approveLoanInfoFormDislayLabel + attrKeys[i]] = approveLoanInfoForm[attrValues[i]];
          }
        }


        if (_status !== 'WaitLoan') {
          postData['attrs'] = approveLoanInfoFormAttrs;   //(初审/复审)
          if (_status == 'FinalAudit') {  //终审
            postData['user'] = approveLoanInfoForm['loanApprovedAssignUsers'];
          }
        } else if (_status == 'WaitLoan') {  //待付款
          let loanTime = approveLoanInfoForm['loanDate'] + " " + approveLoanInfoForm['loanTime'];
          approveLoanInfoFormAttrs['放款时间'] = loanTime;
          postData['attrs'] = approveLoanInfoFormAttrs;
        }
      }

      // console.log(postData)

      this.loadingService.register("loading");
      _self.orderService.onSubmitAuditData(url, postData).subscribe(res => {
        if (res.code === "0") {
          _self.toastService.creatNewMessage({ message: label + "成功" });
          _self.closeRefreshData.emit();
        } else {
          super.openAlert({ title: "提示", message: label + "失败,原因是：" + res.message, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
          // _self.toastService.creatNewMessage({ message: res.message });
        }
        _self.loadingService.resolve("loading");
      }, (err) => {
        super.openAlert({ title: "提示", message: err, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
        _self.loadingService.resolve("loading");
      })
    } else if (type === "HtmlDomCmd.Form") {
      // 
    }
  }

  //根据多文件上传，上传最小数量的限制。 来判断是否可以继续提交 
  multipleFileUploaderLowerLimit() {
    let aduitOption = this.aduitOption;
    let aduitOptionName = this.auditOptionName;
    let status = this.status;

    if (aduitOption) {  //审核结果是必选的   
      if (aduitOption !== 'ProcessNodeAuditOption.GiveUp') {   //选择用户放弃不用验证

        //1. 验证审核结果原因是否选择 
        if (aduitOption !== 'ProcessNodeAuditOption.Adopt') {  //除了'通过'，其它选项原因都是必填 
          if (this.aduitReason() === false) { //验证是否选择审核原因
            return false;
          }
        }


        //2. 验证附件审核结果 
       
        let attachmentGroups = this.loanInfo._attachmentGroups;
        let BreakException = {};
        let notPassNum = 0;
        try {
          attachmentGroups.forEach((element, index) => {
            let attachments = element['_attachments'];
            attachments.forEach((element1, index1) => {
              let currentNum = element1['_files'] ? element1['_files'].length : 0;
              let lowerLimit = element1['needCount'];

              let faceSignPass;
              let faceSignPassJudge;
              if (status == 'FaceSign') {  //审核----面签
                faceSignPass = (aduitOption == 'ProcessNodeAuditOption.Adopt' && element1['limitAudit'] && ((currentNum < lowerLimit) || element1['_status'] !== '待审核'));
                faceSignPassJudge = element1['limitAudit'];
              } else {    //审核----非面签
                faceSignPass = (aduitOption == 'ProcessNodeAuditOption.Adopt' && element1['limitAudit'] && element1['required'] && ((currentNum < lowerLimit) || element1['_status'] !== '待审核'));
                faceSignPassJudge = element1['limitAudit'] && element1['required'];
              }

              //1.审核结果,选择通过时，1)可以审核状态的附件，如果有不通过的选项，则不能继续提交
              //1.审核结果,选择通过时，2)不能审核的且必填的附件，① 状态不为待审核，则不能继续提交  ② 则当前文件的数量 < 规定上传的数量，不能继续提交

              //2.审核结果,选择不通过/退回时，1)可以审核状态的附件，必须都审核（即审核状态必须为'通过'/'不通过'）,才能提交

              if (
                (aduitOption == 'ProcessNodeAuditOption.Adopt' && !element1['limitAudit'] && element1['_status'] !== '通过')
                || faceSignPass
                || (aduitOption !== 'ProcessNodeAuditOption.Adopt' && !element1['limitAudit'] && element1['_status'] !== '通过' && element1['_status'] !== '不通过')
              ) {
                //提示 
                let msg;
                if (aduitOption == 'ProcessNodeAuditOption.Adopt') {

                  if (!element1['limitAudit'] && element1['_status'] !== '通过') {
                    msg = "附件项\"" + element1['name'] + "\"有不通过项";
                  } else if (faceSignPassJudge) {
                    if (element1['_status'] !== '待审核') {
                      msg = "附件项\"" + element1['name'] + "\"有待上传项" + element1['needCount'] + "个文件";
                    } else if (currentNum < lowerLimit) {
                      msg = "附件项\"" + element1['name'] + "\"最少上传" + element1['needCount'] + "个文件";
                    }
                  }

                } else {
                  msg = "附件项\"" + element1['name'] + "\"有待审核项";
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

              //2.审核结果,选择不通过/退回时，2)可以审核状态的附件，必须有一个'不通过',才能提交
              if (aduitOption !== 'ProcessNodeAuditOption.Adopt' && !element1['limitAudit'] && element1['_status'] == '不通过') {
                notPassNum++;
              }

            });
          });

          //2.审核结果,选择不通过/退回时，2)可以审核状态的附件，没有'不通过'状态,则不能提交
          if (aduitOption !== 'ProcessNodeAuditOption.Adopt' && notPassNum == 0) {
            super.openAlert({ title: "提示", message: aduitOptionName + '时，至少应有一个不通过', dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
            throw BreakException;
          }


        } catch (e) {
          return false;   //不能继续提交了
        }


        //3. 验证审核表单 (只有审核结果为通过的时候，才有审核表单)
        if (aduitOption == 'ProcessNodeAuditOption.Adopt') {
          this.submitVerify = true;
          let errData = this._errData;
          for (let i in errData) {
            if (errData[i]) {
              super.openAlert({ title: "提示", message: '请填写完整相关信息', dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
              return false;   //如果有错误，则停止提交
            }
          }
        }

        return true;  //4. 可以继续提交

      } else {
        if (this.aduitReason() === false) { //验证是否选择审核原因
          return false;
        }
        return true;    //选择用户放弃不用验证
      }
    } else {
      super.openAlert({ title: "提示", message: "请选择审核结果", dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
      return false;   //没有选择审核结果，不能继续提交了
    }
  }

  //审核原因验证，（除了通过，其它选项原因都是必填 ） 
  aduitReason() {
    let auditResultReason = this.auditResultReason;
    let auditContent = [];
    auditResultReason.forEach(element => {
      if (element.status) {
        auditContent.push(element.label);
      }
    });
    if (!auditContent || auditContent.length == 0) {
      super.openAlert({ title: "提示", message: "请选择审核原因", dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
      return false;   //没有选择审核原因，不能继续提交了
    }
  }


  /**
   * 记录，验证错误信息
   * 
   * @param {any} e 
   * @param {any} key 
   * @memberof ResponsiveModelComponent
   */
  storeErrData(e, key) {
    //对三级联动地区组件的特殊处理 
    if (Array.isArray(e)) {
      for (const key1 in e) {

        if (e[key1] == '必选') {
          this._errData[key] = '必选';
          return false;
        }
      }
      this._errData[key] = "";

    } else {
      this._errData[key] = e;
    }
  }

}

