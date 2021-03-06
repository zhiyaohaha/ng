import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import {DomSanitizer, SafeResourceUrl, SafeUrl} from "@angular/platform-browser";

import {NgxGalleryHelperService} from "./ngx-gallery-helper.service";

@Component({
  selector: "ngx-gallery-preview",
  template: `
    <ngx-gallery-arrows (onPrevClick)="showPrev()" (onNextClick)="showNext()" [prevDisabled]="!canShowPrev()"
                        [nextDisabled]="!canShowNext()" [arrowPrevIcon]="arrowPrevIcon"
                        [arrowNextIcon]="arrowNextIcon"></ngx-gallery-arrows>
    <div class="ngx-gallery-preview-top">
      <div class="ngx-gallery-preview-icons">
        <i class="ngx-gallery-icon {{zoomOutIcon}}" aria-hidden="true" (click)="zoomOut()" *ngIf="zoom"
           [class.ngx-gallery-icon-disabled]="!canZoomOut()"></i>
        <i class="ngx-gallery-icon {{zoomInIcon}}" aria-hidden="true" (click)="zoomIn()" *ngIf="zoom"
           [class.ngx-gallery-icon-disabled]="!canZoomIn()"></i>
        <i class="ngx-gallery-icon ngx-gallery-fullscreen {{fullscreenIcon}}" aria-hidden="true" *ngIf="fullscreen"
           (click)="manageFullscreen()"></i>
        <i class="ngx-gallery-icon ngx-gallery-close {{closeIcon}}" aria-hidden="true" (click)="close()"></i>
      </div>
    </div>
    <div class="ngx-spinner-wrapper ngx-gallery-center" [class.ngx-gallery-active]="showSpinner">
      <i class="ngx-gallery-icon ngx-gallery-spinner {{spinnerIcon}}" aria-hidden="true"></i>
    </div>
    <div class="ngx-gallery-preview-wrapper" (click)="closeOnClick && close()" (mouseup)="mouseUpHandler($event)"
         (mousemove)="mouseMoveHandler($event)" (touchend)="mouseUpHandler($event)"
         (touchmove)="mouseMoveHandler($event)">
      <div class="ngx-gallery-preview-img-wrapper">
        <img #previewImage class="ngx-gallery-preview-img ngx-gallery-center" [src]="src ? getSafeUrl(src) : '#'"
             (click)="$event.stopPropagation()" (mouseenter)="imageMouseEnter()" (mouseleave)="imageMouseLeave()"
             (mousedown)="mouseDownHandler($event)" (touchstart)="mouseDownHandler($event)"
             [class.ngx-gallery-active]="!loading" [class.ngx-gallery-grab]="canDragOnZoom()"
             [style.transform]="'scale(' + zoomValue + ')'" [style.left]="positionLeft + 'px'"
             [style.top]="positionTop + 'px'"/>
      </div>
      <div class="ngx-gallery-preview-text" *ngIf="showDescription && description">{{ description }}</div>
    </div>
  `,
  styleUrls: ["./ngx-gallery-preview.component.scss"]
})
export class NgxGalleryPreviewComponent implements OnChanges {

  src: string;
  srcIndex: number;
  description: string;
  showSpinner = false;
  positionLeft = 0;
  positionTop = 0;
  zoomValue = 1;
  loading = false;

  @Input() images: string[] | SafeResourceUrl[];
  @Input() descriptions: string[];
  @Input() showDescription: boolean;
  @Input() swipe: boolean;
  @Input() fullscreen: boolean;
  @Input() forceFullscreen: boolean;
  @Input() closeOnClick: boolean;
  @Input() closeOnEsc: boolean;
  @Input() keyboardNavigation: boolean;
  @Input() arrowPrevIcon: string;
  @Input() arrowNextIcon: string;
  @Input() closeIcon: string;
  @Input() fullscreenIcon: string;
  @Input() spinnerIcon: string;
  @Input() autoPlay: boolean;
  @Input() autoPlayInterval: number;
  @Input() autoPlayPauseOnHover: boolean;
  @Input() infinityMove: boolean;
  @Input() zoom: boolean;
  @Input() zoomStep: number;
  @Input() zoomMax: number;
  @Input() zoomMin: number;
  @Input() zoomInIcon: string;
  @Input() zoomOutIcon: string;

  @Output() onOpen = new EventEmitter();
  @Output() onClose = new EventEmitter();

  @ViewChild("previewImage") previewImage: ElementRef;

  private index = 0;
  private isOpen = false;
  private timer;
  private initialX = 0;
  private initialY = 0;
  private initialLeft = 0;
  private initialTop = 0;
  private isMove = false;

  constructor(private sanitization: DomSanitizer,
              private elementRef: ElementRef, private helperService: NgxGalleryHelperService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["swipe"]) {
      this.helperService.manageSwipe(this.swipe, this.elementRef,
        "preview", () => this.showNext(), () => this.showPrev());
    }
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(e) {
    if (this.isOpen) {
      if (this.keyboardNavigation) {
        if (this.isKeyboardPrev(e)) {
          this.showPrev();
        } else if (this.isKeyboardNext(e)) {
          this.showNext();
        }
      }
      if (this.closeOnEsc && this.isKeyboardEsc(e)) {
        this.close();
      }
    }
  }

  open(index: number): void {

    this.onOpen.emit();

    this.index = index;
    this.isOpen = true;
    this.show(true);

    if (this.forceFullscreen) {
      this.manageFullscreen();
    }
  }

  close(): void {
    this.isOpen = false;
    this.closeFullscreen();
    this.onClose.emit();

    this.stopAutoPlay();
  }

  imageMouseEnter(): void {
    if (this.autoPlay && this.autoPlayPauseOnHover) {
      this.stopAutoPlay();
    }
  }

  imageMouseLeave(): void {
    if (this.autoPlay && this.autoPlayPauseOnHover) {
      this.startAutoPlay();
    }
  }

  startAutoPlay(): void {
    if (this.autoPlay) {
      this.stopAutoPlay();

      this.timer = setTimeout(() => {
        if (!this.showNext()) {
          this.index = -1;
          this.showNext();
        }
      }, this.autoPlayInterval);
    }
  }

  stopAutoPlay(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  showNext(): boolean {
    if (this.canShowNext()) {
      this.index++;

      if (this.index === this.images.length) {
        this.index = 0;
      }

      this.show();
      return true;
    } else {
      return false;
    }
  }

  showPrev(): void {
    if (this.canShowPrev()) {
      this.index--;

      if (this.index < 0) {
        this.index = this.images.length - 1;
      }

      this.show();
    }
  }

  canShowNext(): boolean {
    if (this.loading) {
      return false;
    } else if (this.images) {
      return this.infinityMove || this.index < this.images.length - 1 ? true : false;
    } else {
      return false;
    }
  }

  canShowPrev(): boolean {
    if (this.loading) {
      return false;
    } else if (this.images) {
      return this.infinityMove || this.index > 0 ? true : false;
    } else {
      return false;
    }
  }

  manageFullscreen(): void {
    if (this.fullscreen || this.forceFullscreen) {
      const doc = <any>document;

      if (!doc.fullscreenElement && !doc.mozFullScreenElement
        && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        this.openFullscreen();
      } else {
        this.closeFullscreen();
      }
    }
  }

  getSafeUrl(image: string): SafeUrl {
    return image.substr(0, 10) === "data:image" ?
      image : this.sanitization.bypassSecurityTrustUrl(image);
  }

  zoomIn(): void {
    if (this.canZoomIn()) {
      this.zoomValue += this.zoomStep;

      if (this.zoomValue > this.zoomMax) {
        this.zoomValue = this.zoomMax;
      }
    }
  }

  zoomOut(): void {
    if (this.canZoomOut()) {
      this.zoomValue -= this.zoomStep;

      if (this.zoomValue < this.zoomMin) {
        this.zoomValue = this.zoomMin;
      }

      if (this.zoomValue <= 1) {
        this.resetPosition()
      }
    }
  }

  canZoomIn(): boolean {
    return this.zoomValue < this.zoomMax ? true : false;
  }

  canZoomOut(): boolean {
    return this.zoomValue > this.zoomMin ? true : false;
  }

  canDragOnZoom() {
    return this.zoom && this.zoomValue > 1;
  }

  mouseDownHandler(e): void {
    if (this.canDragOnZoom()) {
      this.initialX = this.getClientX(e);
      this.initialY = this.getClientY(e);
      this.initialLeft = this.positionLeft;
      this.initialTop = this.positionTop;
      this.isMove = true;

      e.preventDefault();
    }
  }

  mouseUpHandler(e): void {
    this.isMove = false;
  }

  mouseMoveHandler(e) {
    if (this.isMove) {
      this.positionLeft = this.initialLeft + (this.getClientX(e) - this.initialX);
      this.positionTop = this.initialTop + (this.getClientY(e) - this.initialY);
    }
  }

  private getClientX(e): number {
    return e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
  }

  private getClientY(e): number {
    return e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
  }

  private resetPosition() {
    if (this.zoom) {
      this.positionLeft = 0;
      this.positionTop = 0;
    }
  }

  private isKeyboardNext(e): boolean {
    return e.keyCode === 39 ? true : false;
  }

  private isKeyboardPrev(e): boolean {
    return e.keyCode === 37 ? true : false;
  }

  private isKeyboardEsc(e): boolean {
    return e.keyCode === 27 ? true : false;
  }

  private openFullscreen(): void {
    const element = <any>document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  }

  private closeFullscreen(): void {

    const doc = <any>document;

    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    }
  }

  private show(first: boolean = false) {
    this.loading = true;
    this.stopAutoPlay();

    if (first) {
      this._show();
    } else {
      setTimeout(() => this._show(), 600);
    }
  }

  private _show() {
    this.zoomValue = 1;
    this.resetPosition();

    this.src = <string>this.images[this.index];
    this.srcIndex = this.index;
    this.description = this.descriptions[this.index];

    setTimeout(() => {
      if (this.isLoaded(this.previewImage.nativeElement)) {
        this.loading = false;
        this.startAutoPlay();
      } else {
        setTimeout(() => {
          if (this.loading) {
            this.showSpinner = true;
          }
        });

        this.previewImage.nativeElement.onload = () => {
          this.loading = false;
          this.showSpinner = false;
          this.previewImage.nativeElement.onload = null;
          this.startAutoPlay();
        }
      }
    })
  }

  private isLoaded(img): boolean {
    if (!img.complete) {
      return false;
    }

    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
      return false;
    }

    return true;
  }
}
