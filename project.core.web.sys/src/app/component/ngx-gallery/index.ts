import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';

import {NgxGalleryArrowsComponent} from './ngx-gallery-arrows.component';
import {NgxGalleryImageComponent} from './ngx-gallery-image.component';
import {NgxGalleryThumbnailsComponent} from './ngx-gallery-thumbnails.component';
import {NgxGalleryPreviewComponent} from './ngx-gallery-preview.component';
import {NgxGalleryComponent} from './ngx-gallery.component';

export * from './ngx-gallery.component';
export * from './ngx-gallery-image.component';
export * from './ngx-gallery-thumbnails.component';
export * from './ngx-gallery-preview.component';
export * from './ngx-gallery-arrows.component';
export * from './ngx-gallery-options.model';
export * from './ngx-gallery-image.model';
export * from './ngx-gallery-animation.model';
export * from './ngx-gallery-helper.service';
export * from './ngx-gallery-image-size.model';
export * from './ngx-gallery-layout.model';
export * from './ngx-gallery-order.model';

export class CustomHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      'pinch': { enable: false },
      'rotate': { enable: false }
  };
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgxGalleryArrowsComponent,
    NgxGalleryImageComponent,
    NgxGalleryThumbnailsComponent,
    NgxGalleryPreviewComponent,
    NgxGalleryComponent
  ],
  exports: [
    NgxGalleryComponent
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
  ]
})
export class NgxGalleryModule {}
