import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from "app/services/order/order.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { forEach } from '@angular/router/src/utils/collection';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { TimiSelectModule } from "../../component/timi-select/select.component";
import { TimiInputModule } from "../../component/timi-input/timi-input.component";


@Component({
  selector: 'free-personalLoanInfo',
  templateUrl: './personalLoanInfo.component.html',
  styleUrls: ['./personalLoanInfo.component.scss'],
  providers: [OrderService],
})
export class PersonalLoanInfoComponent implements OnInit {


  @Input() loanInfo: any;    //个人信息和贷款信息 数据
  @Input() readyOnly: boolean = false;   //贷款信息是否只读 

  applyBindDataSwitch: boolean = true; //使用附件组传递的text和value数据，即使传递的数据是null
  constructor(private orderService: OrderService, private fb: FormBuilder) { }

  ngOnInit() {

  }


}
