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
  { path: 'setting-menu', loadChildren: '../setting-menu/setting-menu.module#SettingMenuModule' },
  { path: 'onepage', loadChildren: '../onepage/onepage.module#OnepageModule' },
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
