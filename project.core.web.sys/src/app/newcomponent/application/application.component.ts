import { Component, OnInit } from '@angular/core';
import { OrderService } from "app/services/order/order.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
@Component({
  selector: 'free-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
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
export class ApplicationComponent implements OnInit {
  
  
  loanInfo: any; //贷款信息
  attachmentsDisplay:false; //展现附件组下面的附件项
  uploadUrl:string = "/api/LoanOrder/UploadAttachmentFile"; //附件上传地址
  master:string = "/api/LoanOrder/UploadAttachmentFile";
  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getLoanInfo('5a5485759569d40f74699d72').subscribe(res => {
        if(res.data){
          console.log(res)
          // console.log(res.data._applyFormTemplate.doms)
          this.getLoanInfo(res.data);
        } 
    })
  }
  
  //贷款信息
  getLoanInfo(res) {
    this.loanInfo = res;
  }

  //点击单个附件项的时候，传递当前附件项数据
  displayAttachmentData(attachment,attachmentGroup){
    attachmentGroup.temporaryData = attachment;  //临时存储数据
  }

  //展示一个附件组下的所有附件项
  displayAttachments(val,attachmentGroup,attachmentGroups,index){
      attachmentGroup.temporaryData = "";  //每次切换附件组，下面的附件项都要回到初始状态

      //每次切换，展示当前附件组下面的附件项 
      if( attachmentGroup.attachmentsDisplay === undefined){
        attachmentGroup.attachmentsDisplay = true;
      }else{
        attachmentGroup.attachmentsDisplay = !attachmentGroup.attachmentsDisplay;
      }

      //每次切换，隐藏其它附件组下面的附件项 
      attachmentGroups.forEach((item,i) => {
        if(i !== index){
            item.attachmentsDisplay = false;
          }
      });
  }

  //附件组和附件项的 状态样式
  statusStyle(status){
      let color;
      color = (status == '通过'?'#1aae88':(status == '待审核'?'#177bbb':(status == '待填写'?'#fbb23e':'#e33244')));
      return color;
  } 
}
