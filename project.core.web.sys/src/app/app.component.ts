import {AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {App} from "./pages/app";
import {WebSocketService} from "./services/share/web-socket.service";
import {PreviewService} from "app/services/preview/preview.service";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit {


  @ViewChild("modalPortal", { read: ViewContainerRef }) _modalPortal;
  @ViewChild("overlayPortal", { read: ViewContainerRef }) _overlayPortal;
  @ViewChild("loadingPortal", { read: ViewContainerRef }) _loadingPortal;
  @ViewChild("toastPortal", { read: ViewContainerRef }) _toastPortal;
  viewContainerRef: ViewContainerRef;

  // router跳转动画所需参数
  routerState: boolean = true;
  routerStateCode: string = "active";

  isShowPreview; //是否显示图片预览
  imgUrls; //图片预览的所有链接

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private app: App,
    private wsService: WebSocketService,
    public previewService: PreviewService
    ) {
    this.app.intance = this;
    // this.isShowPreview = previewService.isShowPreview;
    // this.imgUrls = previewService.imgUrls;
  }

  ngOnInit() {

    // this.wsService.createObservableSocket(globalUrl.wsUrl).subscribe(
    //   data => console.log(data),
    //   err => console.log(err),
    //   () => console.log("ws结束！")
    // )
    // setInterval(() => {
    //   this.wsService.sendMesssage("asdfasdfdf21314564");
    // }, 2000);

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
