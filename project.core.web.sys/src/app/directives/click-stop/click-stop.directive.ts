import {Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2} from "@angular/core";

/**
 * 阻止点击事件的冒泡
 */

@Directive({
  selector: "[clickstop]"
})
export class ClickStopDirective implements OnInit, OnDestroy {
  @Output() clickstop = new EventEmitter();
  unsubscribe: () => void;

  constructor(private renderer: Renderer2,
              private element: ElementRef) {
  }

  ngOnInit() {
    this.unsubscribe = this.renderer.listen(
      this.element.nativeElement, "click", event => {
        event.stopPropagation();
        this.clickstop.emit(event);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

}
