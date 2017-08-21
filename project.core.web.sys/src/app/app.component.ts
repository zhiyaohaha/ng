import { Component, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { App } from './pages/app';
import { WebSocketService } from './services/share/web-socket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('modalPortal', { read: ViewContainerRef }) _modalPortal;
  @ViewChild('overlayPortal', { read: ViewContainerRef }) _overlayPortal;
  @ViewChild('loadingPortal', { read: ViewContainerRef }) _loadingPortal;
  @ViewChild('toastPortal', { read: ViewContainerRef }) _toastPortal;
  viewContainerRef: ViewContainerRef;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver, private app: App, private wsService: WebSocketService) {
    this.app.intance = this;
  }

  ngOnInit() {
    this.wsService.createObservableSocket("ws://120.26.39.240:8181/").subscribe(
      data => console.log(data),
      err => console.log(err),
      () => console.log("ws结束！")
    )
  }


  ngAfterViewInit() {

  }

  insertPages(component: any, overlayIndex: number, opt?: any) {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
    let viewContainerRef: any;
    if (overlayIndex === 1) {
      viewContainerRef = this._modalPortal;
    } else if (overlayIndex === 2) {
      viewContainerRef = this._overlayPortal;
    } else if (overlayIndex === 3) {
      viewContainerRef = this._loadingPortal;
    } else if (overlayIndex === 4) {
      viewContainerRef = this._toastPortal;
    }
    // viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    if (opt) {
      (<any>componentRef.instance).data = opt;
    }
    (<any>componentRef.instance).onClose.subscribe(() => {
      componentRef.destroy();
    });

    return (<any>componentRef.instance);
  }

}
