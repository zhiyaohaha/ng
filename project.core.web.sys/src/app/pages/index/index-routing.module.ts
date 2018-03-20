import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IndexComponent } from "./index.component";
import {BranchCountModule} from "../post-loan-management/branch-count/branch-count.module";
import {RepaymentModule} from "../post-loan-management/repayment/repayment.module";
import {SchedulingModule} from "../scheduling/scheduling.module";

const childRoutes: Routes = [
  { path: "dashboard", loadChildren: "../main/main.module#MainModule" },
  { path: "apidoc/:pageCode", loadChildren: "../apidoc/apidoc.module#ApidocModule" },
  { path: "personal/:pageCode", loadChildren: "../personal/personal.module#PersonalModule" },
  { path: "updatePassword/:pageCode", loadChildren: "../update-password/update-password.module#UpdatePasswordModule" },
  {
    path: "parameterManage/:pageCode",
    loadChildren: "../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule"
  },
  { path: "areaManage/:pageCode", loadChildren: "../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule" },
  { path: "memberMap/:pageCode", loadChildren: "../main-member-map/main-member-map.module#MainMemberMapModule" },
  { path: "setting-menu/:pageCode", loadChildren: "../setting-menu/setting-menu.module#SettingMenuModule" },
  //{path: "Log", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  //{path: "operator-history", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  { path: "table-data-model/:pageCode", loadChildren: "../table-data-model/table-data-model.module#TableDataModelModule" },
  {
    path: "mutilple-select-data-model/:pageCode",
    loadChildren: "../mutilple-select-data-model/mutilple-select-data-model.module#MutilpleSelectDataModelModule"
  },
  { path: "form-data-model/:pageCode", loadChildren: "../form-data-model/form-data-model.module#FormDataModelModule" },
  { path: "dp/:pageCode", loadChildren: "../sharepage/sharepage.module#SharepageModule" },
  { path: "cdp/:pageCode", loadChildren: "../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule" },
  { path: "tp/:pageCode", loadChildren: "../template/template.module#TemplateModule" },
  { path: "PhoneBook/:pageCode", loadChildren: "../phone-book/phone-book.module#PhoneBookModule" },
  {
    path: "OrgStructure.GroupMgr/:pageCode",
    loadChildren: "../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule"
  },

  // 三级分销
  { path: "OAMgr.Scheduling/:pageCode", loadChildren: "../scheduling/scheduling.module#SchedulingModule"},
  { path: "LoanMgr.OrderMgr/:pageCode", loadChildren: "../order-manage/order-manage.module#OrderManageModule" },
  { path: "SpreadLevelManage/:pageCode", loadChildren: "../promote/promote.module#PromoteModule" },
  { path: "LoanDemand/:pageCode", loadChildren: "../loandemand/loandemand.module#LoandemandModule" },
  { path: "CapitalRakeBackManage/:pageCode", loadChildren: "../commission/commission.module#CommissionModule" },
  { path: "DataStatistics/:pageCode", loadChildren: "../statistics/statistics.module#StatisticsModule" },
  // 工具（房价评估）
  { path: "Artificial/:pageCode", loadChildren: "../assessment/assessment.module#AssessmentModule"},
  { path: "OnLine/:pageCode", loadChildren: "../online-assessment/online-assessment.module#OnlineAssessmentModule"},
  // 资金管理
  { path: "TradeWithDraw/:pageCode", loadChildren: "../withdrawal/withdrawal.module#WithdrawalModule" },
  // 贷后管理
  {path: "LoanCount/:pageCode", loadChildren: "../post-loan-management/loan-count/loan-count.module#LoanCountModule"},
  {path: "LoanCount/:pageCode/:orgId", loadChildren: "../post-loan-management/loan-count/loan-count.module#LoanCountModule"},
  {path: "BranchCount/:pageCode", loadChildren: "../post-loan-management/branch-count/branch-count.module#BranchCountModule"},
  {path: "RepaymentCount/:pageCode", loadChildren: "../post-loan-management/repayment/repayment.module#RepaymentModule"},
  { path: "", redirectTo: "/main/dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "/error" }
];

const routes: Routes = [{
  path: "", component: IndexComponent, children: childRoutes
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule {
  constructor() {

  }
}
