import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'free-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.scss'],
  providers: [OrderService]
})
export class AssignComponent implements OnInit {

  selectedId:string;//选中人的Id

  @Input() detailData: any;//侧滑数据
  @Input() ids:any; //选中订单的id数组

  constructor(private orderService: OrderService) { }

  ngOnInit() {

  }
  //获取下拉选中的指派人
  getPerson(e){
    this.selectedId = e;
  }
  //确定指派
  onSubmit(){
    this.orderService.onSubmitAssign(this.selectedId,this.ids).subscribe(res=>{
      console.log(res);
    })
  }

}
