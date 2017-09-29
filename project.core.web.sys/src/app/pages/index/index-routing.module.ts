import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index.component';

const childRoutes: Routes = [
  { path: 'dashboard', loadChildren: '../main/main.module#MainModule' },
  { path: 'main', loadChildren: '../main/main.module#MainModule' },
  { path: 'apidoc', loadChildren: '../apidoc/apidoc.module#ApidocModule' },
  { path: 'personal', loadChildren: '../personal/personal.module#PersonalModule' },
  { path: 'updatePassword', loadChildren: '../update-password/update-password.module#UpdatePasswordModule' },
  { path: 'parameterManage', loadChildren: '../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule' },
  { path: 'areaManage', loadChildren: '../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule' },
  { path: 'memberMap', loadChildren: '../main-member-map/main-member-map.module#MainMemberMapModule' },
  { path: 'setting-menu', loadChildren: '../setting-menu/setting-menu.module#SettingMenuModule' },
  { path: 'operator-history', loadChildren: '../sharepage/sharepage.module#SharepageModule' },
  { path: 'table-data-model', loadChildren: '../table-data-model/table-data-model.module#TableDataModelModule' },
  { path: 'mutilple-select-data-model', loadChildren: '../mutilple-select-data-model/mutilple-select-data-model.module#MutilpleSelectDataModelModule' },
  { path: 'form-data-model', loadChildren: '../form-data-model/form-data-model.module#FormDataModelModule' },
  { path: 'sharepage', loadChildren: '../sharepage/sharepage.module#SharepageModule' },
  { path: 'OrgStructure.OrgMgr', loadChildren: '../sharepage/sharepage.module#SharepageModule'},
  { path: 'OrgStructure.UserMgr', loadChildren: '../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule'},
  { path: 'OrgStructure.OrgStructure.UserMgr', loadChildren: '../sharepage/sharepage.module#SharepageModule'},
  { path: 'OrgStructure.JobMgr', loadChildren: '../sharepage/sharepage.module#SharepageModule'},
  { path: 'OrgStructure.RoleMgr', loadChildren: '../sharepage/sharepage.module#SharepageModule'},
  { path: 'OrgStructure.GroupMgr', loadChildren: '../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule'},
  { path: 'OrgStructure.FinanceMgr', loadChildren: '../sharepage/sharepage.module#SharepageModule'},
  { path: '', redirectTo: "/main/dashboard", pathMatch: "full" },
  { path: '**', redirectTo: '/error' }
];

const routes: Routes = [{
  path: '', component: IndexComponent, children: childRoutes
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule {
  constructor() {

  }
}
