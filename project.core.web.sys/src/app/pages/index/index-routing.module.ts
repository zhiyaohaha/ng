import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IndexComponent } from "./index.component";
import { StatisticsComponent } from "app/newcomponent/statistics/statistics.component";


const childRoutes: Routes = [
  { path: "dashboard", loadChildren: "../main/main.module#MainModule" },
  { path: "apidoc", loadChildren: "../apidoc/apidoc.module#ApidocModule" },
  { path: "personal", loadChildren: "../personal/personal.module#PersonalModule" },
  { path: "updatePassword", loadChildren: "../update-password/update-password.module#UpdatePasswordModule" },
  {
    path: "parameterManage",
    loadChildren: "../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule"
  },
  { path: "areaManage", loadChildren: "../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule" },
  { path: "memberMap", loadChildren: "../main-member-map/main-member-map.module#MainMemberMapModule" },
  { path: "setting-menu", loadChildren: "../setting-menu/setting-menu.module#SettingMenuModule" },
  //{path: "Log", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  //{path: "operator-history", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  { path: "table-data-model", loadChildren: "../table-data-model/table-data-model.module#TableDataModelModule" },
  {
    path: "mutilple-select-data-model",
    loadChildren: "../mutilple-select-data-model/mutilple-select-data-model.module#MutilpleSelectDataModelModule"
  },
  { path: "form-data-model", loadChildren: "../form-data-model/form-data-model.module#FormDataModelModule" },
  { path: "dp", loadChildren: "../sharepage/sharepage.module#SharepageModule" },
  { path: "cdp", loadChildren: "../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule" },
  { path: "tp", loadChildren: "../template/template.module#TemplateModule" },
  {
    path: "OrgStructure.GroupMgr",
    loadChildren: "../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule"
  },
  { path: "LoanMgr.OrderMgr", loadChildren: "../order-manage/order-manage.module#OrderManageModule" },
  { path: "SpreadLevelManage", loadChildren: "../promote/promote.module#PromoteModule" },
  { path: "LoanDemand", loadChildren: "../loandemand/loandemand.module#LoandemandModule" },
  // {path: "OrgStructure.FinanceMgr", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  // {path: "SiteMgr.BannerMgr", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  // {path: "SiteMgr.NewsMgr", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  // {path: "SiteMgr.SEOMgr", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  // {path: "LoanMgr.OrderMgr", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  // {path: "LoanMgr.ProductMgr", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  // {path: "ObjectStore.IOMgr", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  // {path: "OAMgr.TaskMgr", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  // {path: "OAMgr.Approval", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  // {path: "ProjectMgr.DebugMgr", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  // {path: "ProjectMgr.VersionMgr", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  // {path: "ProjectMgr.DBMgr", loadChildren: "../sharepage/sharepage.module#SharepageModule"},
  // {path: "dp", redirectTo: "sharepage", pathMatch: "full"},
  { path: "DataStatistics", component: StatisticsComponent },
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
