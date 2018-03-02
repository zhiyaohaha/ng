import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {DomRenderer} from "./../../common/dom";
import {Title} from "@angular/platform-browser";
import {config} from "./../../common/config";
import {CommunicationService} from "./../../services/share/communication.service";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
  providers: [DomRenderer]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  avatar: string;
  leftNav: any[];
  ws: WebSocket;
  title: string;
  icon: string;
  menuItem: any;
  dropdownItem: any;
  isMini: boolean;
  menus = [];
  searchForm: FormGroup;
  theme = [];
  isOpen: boolean;
  searchState: boolean;
  sidebarActive: boolean;
  @ViewChild("setting") settingBtn;
  ElementRef;
  @ViewChild("main") main;

  @HostListener("window:resize")
  onResize() {
    this.resize();
  }
  constructor(private renderer2: Renderer2,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private domRenderer: DomRenderer,
    private pageTitle: Title,
    private myService: CommunicationService
  ) {
    this.resize();
    this.selectTheme("dark");
  }

  ngOnInit() {
    this.avatar = localStorage.getItem("avatar");
    this.leftNav = JSON.parse(localStorage.getItem("menus"));

    // this.ws = new WebSocket("ws://");
    // this.ws.onmessage = (event) => console.log(event);
    // this.ws.onerror = (event) => console.log(event);
    // this.ws.close = (event) => console.log(event);

    // setInterval(() => {
    //   this.ws.send("1111111111");
    // }, 2000)

    this.title = "首页";
    this.icon = "laptop";
    this.menuItem = [{"name": "首页"}, {"name": ""}];
    this.dropdownItem = [{
      "name": "登出",
      "icon": "sign-out",
      "url": "/login"
    }];

    this.searchForm = this.fb.group({
      "keyword": [""]
    });

    this.menus = [
      {"icon": "user"},
      {"icon": "user"},
      {"icon": "user"}
    ];
    this.theme = config.theme;
  }
  ngAfterViewInit() {
    const prefix = this.domRenderer.getWebType();
    this.renderer2.listen("document", "fullscreenchange", function () {
      this.isOpen = !this.isOpen;
    });
  }

  fullscreenToggle() {
    this.domRenderer.toggleFullScreen();
  }

  ngOnDestroy() {

  }

  toggleAside() {
    this.isMini = !this.isMini;
    if (this.isMini) {
      this.renderer2.addClass(document.body, "free-mini");
    } else {
      this.renderer2.removeClass(document.body, "free-mini");
    }
  }

  toggleSearch() {
    this.searchState = !this.searchState;
  }

  onActivate(component) {
    let title = component.pageTitle;
    if (!title) {
      title = "汉力贷款超市系统后台";
    }
    this.pageTitle.setTitle(title);

    // if (!this.isMini) {
    //   this.toggleAside();
    // }

    this.renderer2.setProperty(this.main.nativeElement, "scrollTop", 0);
  }

  onDeactivate(component) {
  }

  open(event: any) {
    this.sidebarActive = !this.sidebarActive;

    if (this.sidebarActive) {
      this.renderer2.addClass(this.settingBtn.nativeElement, "open");
    } else {
      this.renderer2.removeClass(this.settingBtn.nativeElement, "open");
    }
  }

  selectTheme(value: string) {
    const className = document.body.className.split(/\s+/);
    for (const c of className) {
      if (/^free-theme/.test(c)) {
        this.renderer2.removeClass(document.body, c);
      }
    }
    this.renderer2.addClass(document.body, `free-theme-${value}`);
  }

  resize() {
    if (window.innerWidth < 900) {
      this.renderer2.addClass(document.body, "free-mini");
      this.isMini = true;
    }
  }

}
