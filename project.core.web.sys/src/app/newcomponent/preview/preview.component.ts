import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PreviewService } from "app/services/preview/preview.service";


@Component({
  selector: "free-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.scss"]
})
export class PreviewComponent implements OnInit {


  @Input() picArray: string[];
  @Output() outShowPreview = new EventEmitter<any>();
  @ViewChild("prePic") prePic: ElementRef;
  @Input() fileType: string;
  @Input() picIndex: number; //用于接收点击的是第几个图片，多图预览的时候使用

  closepre: boolean = false; //控制父元素中预览图是否展示
  valueOfScale: number = 1; //控制放大缩小，默认1:1
  valueOfrotate: number = 0; //控制左右转
  valueOfSwitch: number = 0; //控制前后图片
  picUrl: string; //图片地址
  isSwitchShow: boolean; //是否显示左右切换


  boxWidth: any;
  boxHeight: any;

  constructor(private previewService: PreviewService) {
  }

  ngOnInit() {
    this.picUrl = this.picIndex ? this.picArray[this.picIndex] : this.picArray[0];
    console.log(this.picIndex);
    if (this.picArray.length > 1) {
      this.isSwitchShow = true;
    } else {
      this.isSwitchShow = false;
    }
    console.log(this.picArray);
  }
  ngAfterViewInit() {
    setTimeout(()=>{
      this.boxWidth = this.prePic.nativeElement.offsetWidth / 2;
      this.boxHeight = this.prePic.nativeElement.offsetHeight / 2;
      this.prePic.nativeElement.style.marginLeft = `-${this.boxWidth}px`;
      this.prePic.nativeElement.style.marginTop = `-${this.boxHeight}px`;
    },0)
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
      this.largen();
    } else if (event.deltaY < 0) {
      this.shrink();
    }
  }

  //拖拽图片
  drag(event, prePic) {

    // clientX浏览器左侧到鼠标点击的距离
    // offsetLeft中心块儿到浏览器左侧的距离
    // distanceX鼠标点击中心块到中心块左侧的距离

    let distanceX = event.clientX - prePic.offsetLeft;
    let distanceY = event.clientY - prePic.offsetTop;

    document.onmousemove = (evt) => {
      let left = evt.clientX - distanceX + this.boxWidth;
      let top = evt.clientY - distanceY + this.boxHeight;

      prePic.style.left = left + "px";
      prePic.style.top = top + "px";
    };

    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
    return false;
  }

  //根据传入图片数量判断是否添加左右切换效果
  pre() {
    if (this.picIndex > 0) {
      this.picIndex -= 1;
      this.picUrl = this.picArray[this.picIndex];
    } else {
      this.picIndex = 0;
      this.picUrl = this.picArray[this.picIndex];
    }
    setTimeout(()=>{
      this.boxWidth = this.prePic.nativeElement.offsetWidth / 2;
      this.boxHeight = this.prePic.nativeElement.offsetHeight / 2;
      this.prePic.nativeElement.style.marginLeft = `-${this.boxWidth}px`;
      this.prePic.nativeElement.style.marginTop = `-${this.boxHeight}px`;
    },0)
  }

  next() {
    if (this.picIndex < this.picArray.length - 1) {
      this.picIndex += 1;
      this.picUrl = this.picArray[this.picIndex];
    } else {
      this.picIndex = this.picArray.length - 1;
      this.picUrl = this.picArray[this.picIndex];
    }
    setTimeout(()=>{
      this.boxWidth = this.prePic.nativeElement.offsetWidth / 2;
      this.boxHeight = this.prePic.nativeElement.offsetHeight / 2;
      this.prePic.nativeElement.style.marginLeft = `-${this.boxWidth}px`;
      this.prePic.nativeElement.style.marginTop = `-${this.boxHeight}px`;
    },0)
  }
}
