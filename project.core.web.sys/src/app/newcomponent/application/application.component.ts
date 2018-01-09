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
  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getLoanInfo('5a530599edefe1227c8d4626').subscribe(res => {
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
  displayAttachments(val,attachmentGroup){
      attachmentGroup.temporaryData = "";  //每次切换附件组，下面的附件项都要回到初始状态
      if(val === undefined){
          console.log(val)
          return true;
      }else{
        return !val;
      }
  }
}
