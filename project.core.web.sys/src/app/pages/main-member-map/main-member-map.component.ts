import { Component, OnInit, Input } from "@angular/core";
import { BaseService } from "./../../services/base.service";
import { FnUtil } from "./../../common/fn-util";

@Component({
  selector: "app-main-member-map",
  templateUrl: "./main-member-map.component.html",
  styleUrls: ["./main-member-map.component.scss"]
})
export class MainMemberMapComponent implements OnInit {

  datas;

  constructor(private baseService: BaseService, private fnUtil: FnUtil) { }

  ngOnInit() {
    this.baseService.get(this.fnUtil.searchAPI("SystemSetting.MemberMindMapping.View")).subscribe(r => {
      if (r.code === "0") {
        this.datas = r.data;
      }
    });
  }

}


@Component({
  selector: "app-main-member-map-list",
  template: `
      <ul>
      <li class="wrap-li">
          {{data.description}}
          <div class="wrap-div">
            <ul>
                <li *ngFor="let item of data.fields" [ngClass]="{'wrap-li' : item.target}">
                    {{item.description}}<span class="pull-right">{{item._type == 'string' ? '(string)' : ''}}</span>
                    <ng-container *ngIf="item.target">
                        <app-main-member-map-list [data]="item.target"></app-main-member-map-list>
                    </ng-container>
                </li>
            </ul>
          </div>
      </li>
    </ul>
  `,
  styles: [``]
})
export class MainMemberMapListComponent {
  @Input() data;
  constructor() { }
}
