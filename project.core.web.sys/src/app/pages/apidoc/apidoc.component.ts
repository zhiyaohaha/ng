import {Component, Input, OnInit} from "@angular/core";
import {BaseService} from "../../services/base.service";
import {fadeInUp} from "../../common/animations";
import {Wiki} from "../../models/Wiki";
import {WikiGroup} from "../../models/WikiGroup";
import {isArray, isNumber, isObject, isString} from "util";

@Component({
  selector: "app-apidoc",
  templateUrl: "./apidoc.component.html",
  styleUrls: ["./apidoc.component.scss"],
  animations: [fadeInUp]
})
export class ApidocComponent implements OnInit {

  list: Wiki;

  result: WikiGroup[];

  show: boolean = true;
  display: string = "隐藏注释";

  constructor(private service: BaseService) {
  }

  ngOnInit() {
    this.service.get("/api/Wiki/Doc").subscribe(res => {
      this.result = res.data;
    });
  }

  /**
   * 调到第num条
   */
  goTo(index, num) {
    this.list = this.result[index].includes[num];
  }

  /**
   * 显示隐藏注释
   */
  changeToggle() {
    this.show = !this.show;
    if (this.show) {
      this.display = "隐藏注释";
    } else {
      this.display = "显示注释";
    }
  }

}


@Component({
  selector: "params-list",
  template: `
    <div class="ml20">
      <ng-container>
        <div *ngIf="paramType.indexOf(param.type) > -1">
          <span [ngClass]="{'must-param':!param.optional}">"{{param.name}}"</span>:
          <ng-container *ngIf="param._default === ''">""</ng-container>
          <ng-container *ngIf="param._default === null">null</ng-container>
          <ng-container *ngIf="param._default === 0">0</ng-container>
          <ng-container *ngIf="param._default">{{param._default}}</ng-container>,
          <span class="desc" *ngIf="comments">//{{param.description}}&nbsp;&nbsp;&nbsp;类型:{{param.type}}</span>
        </div>
        <div *ngIf="param.type === 'object' || param.type === 'KV'">
          <span [ngClass]="{'must-param':!param.optional}">"{{param.name}}"</span>:
          <ng-container *ngIf="param.includes.length > 0">
            {{ "{" }} <span class="desc" *ngIf="comments">//{{param.description}}&nbsp;&nbsp;&nbsp;类型:{{param.type}}</span>
              <params-list *ngFor="let item of param.includes" [params]="item" [comments]="comments"></params-list>
            {{ "}," }}
          </ng-container>          
          <ng-container *ngIf="param._default === null && param.includes.length === 0">
            null <span class="desc" *ngIf="comments">//{{param.description}}&nbsp;&nbsp;&nbsp;类型:{{param.type}}</span>
          </ng-container>
        </div>
        <div *ngIf="param.type.indexOf('[]') > -1">
          <span [ngClass]="{'must-param':!param.optional}">"{{param.name}}"</span>:
          <ng-container *ngIf="param.includes.length > 0">
            [ <span class="desc" *ngIf="comments">//{{param.description}}&nbsp;&nbsp;&nbsp;类型:{{param.type}}</span>
              <ng-container *ngIf="paramType.indexOf(param.type) === -1">
                <div class="ml20">
                  {{"{"}}
                  <params-list *ngFor="let item of param.includes" [params]="item" [comments]="comments"></params-list>
                  {{"},"}}
                </div>
              </ng-container>
              <ng-container *ngIf="paramType.indexOf(param.type) > -1">
                <params-list *ngFor="let item of param.includes" [params]="item" [comments]="comments"></params-list>
              </ng-container>
            ],  
          </ng-container>
          <ng-container *ngIf="param._default === null && param.includes.length === 0">
            null <span class="desc" *ngIf="comments">//{{param.description}}&nbsp;&nbsp;&nbsp;类型:{{param.type}}</span>
          </ng-container>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .ml20 {
      margin-left: 20px;
    }

    .desc {
      margin-left: 10px;
      color: #aaa;
    }

    .must-param {
      color: red;
    }
  `]
})
export class ParamsListComponent {

  @Input() comments: boolean;

  @Input()
  set params(value) {
    // this.paramType = this.JudgementParam(value);
    this.returns = value.returns;
    this.param = value;
  }

  paramType: string[] = ["string", "int", "bool", "decimal", "long", "Date"];

  returns;
  param;

  /**
   * 判断类型
   */
  JudgementParam(data) {
    if (isNumber(data)) {
      return "number";
    } else if (isArray(data)) {
      return "array";
    } else if (isObject(data)) {
      return "object";
    } else if (isString(data)) {
      return "string";
    } else if (isNumber(data)) {
      return "number";
    }
  }
}
