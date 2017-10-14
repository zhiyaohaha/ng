import {CommonModule} from "@angular/common";
import { NgModule, Component, Input } from "@angular/core";

@Component({
  selector: "timi-json",
  template: `
    <div class="ml30">
      <ng-container>
        <div *ngIf="paramType.indexOf(param.type) > -1">
          <span [ngClass]="{'must-param':!param.optional}">"{{param.name}}"</span>:
          <ng-container *ngIf="param._default === ''">"",</ng-container>
          <ng-container *ngIf="param._default === null">null,</ng-container>
          <ng-container *ngIf="param._default === 0">0,</ng-container>
          <ng-container *ngIf="param._default">{{param._default}},</ng-container>
          <span class="desc" *ngIf="comments">//{{param.description}}&nbsp;&nbsp;&nbsp;类型:{{param.type}}</span>
        </div>
        <!--<div *ngIf="param.type === 'object' || param.type === 'KV'">-->
          <!--<span [ngClass]="{'must-param':!param.optional}">"{{param.name}}"</span>:-->
          <!--<ng-container *ngIf="param.includes?.length > 0">-->
            <!--{{ "{" }} <span class="desc" *ngIf="comments">//{{param.description}}&nbsp;&nbsp;&nbsp;类型:{{param.type}}</span>-->
              <!--<timi-json *ngFor="let item of param.includes" [params]="item" [comments]="comments"></timi-json>-->
            <!--{{ "}," }}-->
          <!--</ng-container>          -->
          <!--<ng-container *ngIf="param._default === null && param.includes?.length === 0">-->
            <!--null, <span class="desc" *ngIf="comments">//{{param.description}}&nbsp;&nbsp;&nbsp;类型:{{param.type}}</span>-->
          <!--</ng-container>-->
        <!--</div>-->
        <div *ngIf="param.type.indexOf('[]') > -1">
          <span [ngClass]="{'must-param':!param.optional}">"{{param.name}}"</span>:
          <ng-container *ngIf="param.includes?.length > 0">
            [ <span class="desc" *ngIf="comments">//{{param.description}}&nbsp;&nbsp;&nbsp;类型:{{param.type}}</span>
              <ng-container *ngIf="paramType.indexOf(param.type) === -1">
                <div class="ml30">
                  {{"{"}}
                  <timi-json *ngFor="let item of param.includes" [params]="item" [comments]="comments"></timi-json>
                  {{"},"}}
                </div>
              </ng-container>
              <ng-container *ngIf="paramType.indexOf(param.type) > -1">
                <timi-json *ngFor="let item of param.includes" [params]="item" [comments]="comments"></timi-json>
              </ng-container>
            ],  
          </ng-container>
          <ng-container *ngIf="param._default === null && param.includes?.length === 0">
            null, <span class="desc" *ngIf="comments">//{{param.description}}&nbsp;&nbsp;&nbsp;类型:{{param.type}}</span>
          </ng-container>
        </div>
        <div *ngIf="paramType.indexOf(param.type) === -1">
          <span [ngClass]="{'must-param':!param.optional}">"{{param.name}}"</span>:
          <ng-container *ngIf="param.includes?.length > 0">
            {{ "{" }} <span class="desc" *ngIf="comments">//{{param.description}}&nbsp;&nbsp;&nbsp;类型:{{param.type}}</span>
            <timi-json *ngFor="let item of param.includes" [params]="item" [comments]="comments"></timi-json>
            {{ "}," }}
          </ng-container>
          <ng-container *ngIf="param._default === null || param.includes?.length === 0">
            null, <span class="desc" *ngIf="comments">//{{param.description}}&nbsp;&nbsp;&nbsp;类型:{{param.type}}</span>
          </ng-container>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .ml30 {
      margin-left: 30px;
    }

    .desc {
      margin-left: 20px;
      color: #aaa;
    }

    .must-param {
      color: red;
    }
  `]
})

export class TimiJSONComponent {

  @Input() comments: boolean;

  @Input()
  set params(value) {
    this.param = value;
  }
  get params() {
    return this.param;
  }

  paramType: string[] = ["string", "int", "bool", "boolean", "decimal", "long", "Date"];
  param;

}

@NgModule({
  imports: [CommonModule],
  declarations: [TimiJSONComponent],
  exports: [TimiJSONComponent]
})

export class TimiJSONComponentModule { }
