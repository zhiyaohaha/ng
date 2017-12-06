import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { PreviewService } from "app/services/preview/preview.service";


@Component({
  selector: 'free-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {


  @Input() picArray: string[];
  @Output() outShowPreview = new EventEmitter<any>();
  @ViewChild('prePic') prePic: ElementRef;


  closepre: boolean = false;//控制父元素中预览图是否展示
  valueOfScale: number = 1;//控制放大缩小，默认1:1
  valueOfrotate: number = 0;//控制左右转
  valueOfSwitch:number=0;//控制前后图片
  picUrl: string;//图片地址
  isSwitchShow:boolean;//是否显示左右切换


  constructor(private previewService: PreviewService) { }

  ngOnInit() {
    this.picUrl = this.picArray[0];
    if(this.picArray.length>1){
      this.isSwitchShow = true;
    }else{
      this.isSwitchShow = false;
    }    
  }
  closebtn() {
    this.previewService.closePreview(false);
  }
  //放大功能按钮
  largen() {
    if (this.valueOfScale <= 4) {
      this.valueOfScale += 0.1;
      this.prePic.nativeElement.style.transform = `rotate(${this.valueOfrotate}deg) scale(${this.valueOfScale})`;
    }
  }
  //缩小功能按钮
  shrink() {
    if (this.valueOfScale >= 0.7) {
      this.valueOfScale -= 0.1;
      this.prePic.nativeElement.style.transform = `rotate(${this.valueOfrotate}deg) scale(${this.valueOfScale})`;
    }
  }
  //向左旋转按钮
  turnLeft() {
    this.valueOfrotate += 90;
    this.prePic.nativeElement.style.transform = `rotate(${this.valueOfrotate}deg) scale(${this.valueOfScale})`;
  }
  //向右旋转按钮
  turnRight() {
    this.valueOfrotate -= 90;
    this.prePic.nativeElement.style.transform = `rotate(${this.valueOfrotate}deg) scale(${this.valueOfScale})`;
  }
  //还原缩放比1:1
  restore() {
    this.valueOfScale = 1;
    this.prePic.nativeElement.style.transform = `rotate(${this.valueOfrotate}deg) scale(${this.valueOfScale})`;
  }
  //滚动放大缩小图片
  listenToMousewheel(event) {
    if (event.deltaY > 0) {
      console.log('向下滚动,放大图片');
      this.largen();
    } else if (event.deltaY < 0) {
      console.log('向上滚动，缩小图片');
      this.shrink();
    }

  }
  //拖拽图片
  drag(event, prePic){
   
    // let distanceX = event.clientX - prePic.offsetLeft;
    // let distanceY = event.clientY - prePic.offsetTop;
    
    document.onmousemove=function (evt) {
      let left = evt.clientX;
      let top = evt.clientY;
      
      prePic.style.left=left+'px';
      prePic.style.top=top+'px';
    }
    
    document.onmouseup=function () {
      document.onmousemove=null;
      document.onmouseup=null;
    }

    return false;
  }
  //根据传入图片数量判断是否添加左右切换效果
  pre(){
    if(this.valueOfSwitch>0){
      this.valueOfSwitch -=1;
      this.picUrl = this.picArray[this.valueOfSwitch];
    }else{
      this.valueOfSwitch = 0;
      this.picUrl = this.picArray[this.valueOfSwitch];
    }
  }
  next(){
    if(this.valueOfSwitch<this.picArray.length-1){
      this.valueOfSwitch += 1;
      this.picUrl = this.picArray[this.valueOfSwitch];
    }else{
      this.valueOfSwitch = this.picArray.length-1;
      this.picUrl = this.picArray[this.valueOfSwitch];
    }   
    
  }
}