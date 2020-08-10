import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UneteNosotrosPage } from './unete-nosotros.page';

const routes: Routes = [
  {
    path: '',
    component: UneteNosotrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UneteNosotrosPageRoutingModule {}
