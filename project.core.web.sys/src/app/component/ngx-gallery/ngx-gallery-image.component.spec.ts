import {Renderer, SimpleChange} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import {NgxGalleryArrowsComponent, NgxGalleryHelperService, NgxGalleryImageComponent} from "./";

export class CustomHammerConfig extends HammerGestureConfig  {
    overrides = <any>{
        'pinch': { enable: false },
        'rotate': { enable: false }
    };
  }

describe('NgxGalleryArrowsComponent', () => {
    let fixture: ComponentFixture<NgxGalleryImageComponent>;
    let comp: NgxGalleryImageComponent;
    let el, prevArrow, nextArrow;

    beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [ NgxGalleryImageComponent, NgxGalleryArrowsComponent ],
          providers: [ NgxGalleryHelperService, Renderer,
            { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig } ]
        })
        .overrideComponent(NgxGalleryImageComponent, {
            set: {
                styleUrls: [],
            }
        });

        fixture = TestBed.createComponent(NgxGalleryImageComponent);
        comp = fixture.componentInstance;
        comp.images = ['image-1.jpg', 'image-2.jpg', 'image-3.jpg'];
        el = fixture.debugElement.nativeElement;
    });

    it('should create component', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should show next image', () => {
        comp.selectedIndex = 0;
        let status = comp.showNext();

        expect(status).toBeTruthy();
        expect(comp.selectedIndex).toEqual(1);
    });

    it('should not show next image if there is no more images', () => {
        comp.selectedIndex = 2;
        let status = comp.showNext();

        expect(status).toBeFalsy();
        expect(comp.selectedIndex).toEqual(2);
    });

    it('should start from the beggining if there is no more images and infinity move is true', () => {
        comp.selectedIndex = 2;
        comp.infinityMove = true;
        let status = comp.showNext();

        expect(status).toBeTruthy();
        expect(comp.selectedIndex).toEqual(0);
    });

    it('should show prev image', () => {
        comp.selectedIndex = 1;
        comp.showPrev();

        expect(comp.selectedIndex).toEqual(0);
    });

    it('should not show prev image if there is no more images', () => {
        comp.selectedIndex = 0;
        comp.showPrev();

        expect(comp.selectedIndex).toEqual(0);
    });

    it('should start from the end if there is no more images and infinity move is true', () => {
        comp.selectedIndex = 0;
        comp.infinityMove = true;
        comp.showPrev();

        expect(comp.selectedIndex).toEqual(2);
    });

    it('should prevent showing images if images arent defined', () => {
        comp.images = undefined;

        expect(comp.canShowNext()).toBeFalsy();
        expect(comp.canShowPrev()).toBeFalsy();
    });

    it('should emit event onClick after click on image', (done) => {
        comp.onClick.subscribe((index) => {
            expect(index).toEqual(1);
            done()
        });

        comp.clickable = true;
        fixture.detectChanges();
        el.querySelectorAll('.ngx-gallery-image')[1].click();
    });

    it('should hide arrows on the begining if arrowsAutoHide is true', () => {
        comp.arrowsAutoHide = true;
        comp.arrows = true;
        fixture.detectChanges();

        expect(comp.arrows).toBeFalsy();
    });

    it('should show arrows on mouseenter if arrowsAutoHide is true', () => {
        comp.arrowsAutoHide = true;
        fixture.detectChanges();

        el.dispatchEvent(new Event('mouseenter'));

        expect(comp.arrows).toBeTruthy();
    });

    it('should hide arrows on mouseleave if arrowsAutoHide is true', () => {
        comp.arrowsAutoHide = true;
        comp.arrows = true;
        fixture.detectChanges();
        comp.arrows = true;

        el.dispatchEvent(new Event('mouseleave'));

        expect(comp.arrows).toBeFalsy();
    });

    it('should show next image after autoPlayInterval', (done) => {
        comp.autoPlay = true;
        comp.autoPlayInterval = 100;
        comp.selectedIndex = 0;
        fixture.detectChanges();

        setTimeout(() => {
            expect(comp.selectedIndex).toEqual(1);
            done();
        }, 150)
    });

    it('should stop auto play on moveenter if autoPlayPauseOnHover is true', (done) => {
        comp.autoPlay = true;
        comp.autoPlayInterval = 100;
        comp.autoPlayPauseOnHover = true;
        comp.selectedIndex = 0;
        fixture.detectChanges();

        el.dispatchEvent(new Event('mouseenter'));

        setTimeout(() => {
            expect(comp.selectedIndex).toEqual(0);
            done();
        }, 150)
    });

    it('should start auto play on mouseleave if autoPlayPauseOnHover is true', (done) => {
        comp.autoPlay = true;
        comp.autoPlayInterval = 100;
        comp.autoPlayPauseOnHover = true;
        comp.selectedIndex = 0;
        fixture.detectChanges();

        el.dispatchEvent(new Event('mouseenter'));
        el.dispatchEvent(new Event('mouseleave'));

        setTimeout(() => {
            expect(comp.selectedIndex).toEqual(1);
            done();
        }, 150)
    });

    it('should validate selected index after images count change', () => {
        fixture.detectChanges();
        comp.selectedIndex = 2;

        comp.images = ['image1.jpg', 'image2.jpg'];
        comp.ngOnChanges({
            images: new SimpleChange(null, comp.images, true)
        });

        fixture.detectChanges();

        expect(comp.selectedIndex).toEqual(0);
    });
});
