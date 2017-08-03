import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index.component';

const childRoutes: Routes = [
  { path: '', loadChildren: '../main/main.module#MainModule' },
  { path: 'apidoc', loadChildren: '../apidoc/apidoc.module#ApidocModule' },
  { path: 'personal', loadChildren: '../personal/personal.module#PersonalModule' },
  { path: 'parameterManage', loadChildren: '../main-parameter-manage/main-parameter-manage.module#MainParameterManageModule' },
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
