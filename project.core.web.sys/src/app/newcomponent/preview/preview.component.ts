import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'free-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  @Output() outShowPreview = new EventEmitter<any>();
  @ViewChild('prePic') prePic: ElementRef;

  closepre: boolean = false;//控制父元素中预览图是否展示
  valueOfScale: number = 1;//控制放大缩小，默认1:1
  valueOfrotate: number = 0;//控制左右转


  constructor() { }

  ngOnInit() {
  }
  closebtn() {
    this.outShowPreview.emit(this.closepre);
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
}