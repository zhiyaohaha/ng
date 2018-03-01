import {Component, EventEmitter, forwardRef, Inject, Input, OnInit, Output} from "@angular/core";
import {BaseService} from "../../services/base.service";
import {User} from "../../models/User";
import {BaseUIComponent} from "../baseUI.component";
import {ToastService} from "../../component/toast/toast.service";
import {TdLoadingService} from "@covalent/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-scheduling",
  templateUrl: "./scheduling.component.html",
  styleUrls: ["./scheduling.component.scss"]
})
export class SchedulingComponent extends BaseUIComponent implements OnInit {

  tree; // 左侧人员列表
  treeUsers: UserListModel[]; // 左侧搜索人员
  activeId: string; // 左侧搜索激活ID
  userInfo; // 右侧人员信息
  weekdays = [
    {active: false, value: 1, label: "一"},
    {active: false, value: 2, label: "二"},
    {active: false, value: 3, label: "三"},
    {active: false, value: 4, label: "四"},
    {active: false, value: 5, label: "五"},
    {active: false, value: 6, label: "六"},
    {active: false, value: 0, label: "日"}
  ];

  constructor(private baseService: BaseService,
              private loading: TdLoadingService,
              private toastService: ToastService,
              private activatedRoute: ActivatedRoute) {
    super(loading, activatedRoute);
  }

  ngOnInit() {
    this.treeUsers = [];
    this.getUsersLists("");
  }

  // 获取左侧列表
  getUsersLists(keywords) {
    this.baseService.get("/api/Scheduling/GetBelowUsers", {keywords: keywords})
      .subscribe(
        res => {
          this.tree = res.data as UserListModel[];
        }
      );
  }

  /**
   * 左侧人员列表搜索
   * @param $event
   */
  searchUserList($event) {
    this.getUsersLists($event.target.value);
  }

  // 获取右侧员工信息
  getUserInfo(id: string, keywords: string) {
    this.baseService.get("/api/Scheduling/GetDetail", {id: id, keywords: keywords})
      .subscribe(
        res => {
          if (res.code = "0") {
            this.userInfo = res.data;
            this.weekdays.map(item => {
              if (Array.isArray(this.userInfo.weekdays)) {
                item.active = this.userInfo.weekdays.includes(item.value);
              } else {
                item.active = false;
              }
            });
          }
        }
      );
  }

  // 右侧组织搜索
  searchOrgs($event) {
    this.getUserInfo(this.activeId, $event.target.value);
  }

  /**
   * 点击tree节点触发的事件
   * @param $event
   */
  onNodeSelect($event) {
    this.activeId = $event.id;
    this.getUserInfo($event.id, "");
  }

  // 设置员工日期
  setWeekday($event) {
    $event.active = !$event.active;
    this.userInfo.weekdays = this.weekdays.filter(item => item.active)
      .map(item => item.value);
  }

  // 获取组织
  getOrgs(data) {
    let arr = [];
    data.forEach(item => {
      if (item.active) {
        arr.push(item.id);
      }
      if (item.childrens && item.childrens.length > 0) {
        arr = arr.concat(this.getOrgs(item.childrens));
      }
    });
    return arr;
  }



  // 提交人员信息
  submit() {
    console.log(this.userInfo);
    let data = {
      user: "",
      weekdays: [],
      orgs: []
    };
    data.user = this.userInfo.id;
    data.weekdays = this.userInfo.weekdays;
    data.orgs = this.getOrgs(this.userInfo.orgs);
    this.baseService.post("/api/Scheduling/Set", data)
      .subscribe(
        res => {
          if (res.code === "0") {
            super.showToast(this.toastService, "操作成功");
          }
        }
      );
  }

}

@Component({
  selector: "user-list",
  templateUrl: "user-list.component.html",
  styleUrls: ["user-list.component.scss"]
})

export class UserListComponent {

  activeId: string;

  @Input() data: UserListModel[];
  @Input() multiple: boolean = false;

  @Output() onNodeSelect: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  /**
   * 取消所有的选中状态
   * @param data
   */
  cancelActive(data) {
    data.map(item => {
      if (item.childrens) {
        this.cancelActive(item.childrens);
      } else {
        if (item.id === this.activeId) {
          if (!item.active) {
            item.active = true;
          }
        } else {
          item.active = false;
        }
      }
    });
  }

  changeActive(data: UserListModel) {
    this.activeId = data.id;
    if (!data.active) {
      this.onNodeSelect.emit(data);
    }
    this.cancelActive(this.data);
  }

}

export class UserListModel {
  expand: boolean;
  active: boolean;
  id: string;
  name: string;
  parentId: string;
  childrens: UserListModel[];
}

@Component({
  selector: "user-list-item",
  template: `
    <li>
      <div (click)="toggle(data)" [ngClass]="{active: !data.childrens && data.active}">
      <span class="fa fa-fw" [ngClass]="{'fa-caret-right': !data.expand, 'fa-caret-down': data.expand}"
            *ngIf="data.childrens && data.childrens.length > 0"></span>
        {{data.name}}
      </div>
      <ng-template [ngIf]="data.childrens && data.childrens.length > 0">
        <ul [hidden]="!data.expand">
          <user-list-item *ngFor="let item of data.childrens" [data]="item"></user-list-item>
        </ul>
      </ng-template>
    </li>
  `,
  styles: [`
    .active {
      color: red;
    }`]
})

export class UserListItemComponent {
  @Input() data: UserListModel;
  @Input() multiple: boolean = false;

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Inject(forwardRef(() => UserListComponent)) public userListComponent: UserListComponent) {
  }

  toggle($event: UserListModel) {
    if (!$event.childrens) {
      this.userListComponent.changeActive($event);
    } else {
      $event.expand = !$event.expand;
    }
  }
}

@Component({
  selector: "group-list",
  template: `
    <li>
      <free-checkbox (onChange)="onChange($event)" [checked]="data.active" [label]="data.name"></free-checkbox>
      <ng-template [ngIf]="data.childrens && data.childrens.length > 0">
        <ul class="child-ul">
          <group-list *ngFor="let item of data.childrens" [data]="item"></group-list>
        </ul>
      </ng-template>
    </li>
  `,
  styles: [`
  .child-ul {
    margin-left: 1.4rem;
  }
  `]
})

export class GroupListComponent {

  @Input() data: UserListModel;

  constructor(@Inject(forwardRef(() => SchedulingComponent)) public schedulingComponent: SchedulingComponent) {}

  onChange($event) {
    this.data.active = !this.data.active;
    console.log(this.data);
    this.schedulingComponent.submit();
  }

}
