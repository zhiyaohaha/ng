import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderService } from "app/services/order/order.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { forEach } from '@angular/router/src/utils/collection';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { TimiSelectModule } from "../../component/timi-select/select.component";
import { TimiInputModule } from "../../component/timi-input/timi-input.component";


@Component({
  selector: 'free-personalLoanInfo',
  templateUrl: './personalLoanInfo.component.html',
  styleUrls: ['./personalLoanInfo.component.scss', "../../common/directive/validators.directive.scss"],
  providers: [OrderService],
})
export class PersonalLoanInfoComponent implements OnInit {


  @Input() loanInfo: any;    //个人信息和贷款信息 数据
  @Input() readyOnly: boolean = false;   //贷款信息是否只读 

  applyBindDataSwitch: boolean = true; //使用附件组传递的text和value数据，即使传递的数据是null

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
  @Output() submitErrorData: EventEmitter<any> = new EventEmitter();
  @Input()
  set manualVerificationForm(value) {  //手动验证
    if (value) {
      //验证：点击提交，开始统一验证所有组件。 
      this.submitVerify = true;
      this.submitErrorData.emit(this._errData);
    }
  }

  constructor(private orderService: OrderService, private fb: FormBuilder) { }

  ngOnInit() {

  }

  /**
   * 记录，验证错误信息
   * 
   * @param {any} e 
   * @param {any} key 
   * @memberof ResponsiveModelComponent
   */
  storeErrData(e, key) {
    this._errData[key] = e;
  }
}
