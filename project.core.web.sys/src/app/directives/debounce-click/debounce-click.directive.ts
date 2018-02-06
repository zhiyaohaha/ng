import {
  Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output
} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";

/**
 * 点击事件的防抖
 * 在防抖时间内只执行第一次事件
 */

@Directive({
  selector: "[debounceclick]"
})
export class DebounceClickDirective implements OnInit, OnDestroy {

  @Input() debounceTime = 300; // 防抖时间 好眠
  @Output() debounceclick = new EventEmitter(); // 发射事件
  private clicks = new Subject();
  private subscription: Subscription;
  private timmer;

  @HostListener("click", ["$event"])
  clickEvent(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.emitEvent();
  }

  constructor() {

  }

  ngOnInit() {
    this.subscription = this.clicks
      .subscribe(e => {
        this.debounceclick.emit(e);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  emitEvent() {
    if (!this.timmer) {
      this.clicks.next(event);
      this.timmer = setTimeout(() => {
        this.timmer = null;
      }, this.debounceTime);
    } else if (this.timmer) {
      clearTimeout(this.timmer);
      this.timmer = setTimeout(() => {
        this.timmer = null;
      }, this.debounceTime);
    }
  }

}
