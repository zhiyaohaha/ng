import { Injectable } from '@angular/core';

@Injectable()
export class PreviewService {

  isShowPreview: boolean;
  imgUrls: string[]

  constructor() { }

  showPreview($event: boolean) {
    this.isShowPreview = $event;
  }
  closePreview($event: boolean) {
    this.isShowPreview = $event;
  }
  getUrl(imgUrls: string[]) {
    this.imgUrls = imgUrls;
  }
  
}
