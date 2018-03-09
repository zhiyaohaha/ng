import {Component, OnInit} from "@angular/core";
import {fadeIn} from "../../common/animations";
import {LoginOutService} from "../../services/loginOut-service/loginOut.service";
import {UEditorConfig} from "ngx-ueditor";
import {BaseUIComponent} from "../baseUI.component";
import {ToastService} from "../../component/toast/toast.service";
import {TdLoadingService} from "@covalent/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  animations: [fadeIn],
  providers: [LoginOutService, UEditorConfig, TdLoadingService]
})
export class MainComponent extends BaseUIComponent implements OnInit {

  loader;

  constructor(private toastService: ToastService,
              private loadingService: TdLoadingService,
              private routerInfor: ActivatedRoute) {
    super(loadingService, routerInfor);
  }

  ngOnInit() {

  }

}
