import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuponesPage } from './cupones.page';

const routes: Routes = [
  {
    path: '',
    component: CuponesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuponesPageRoutingModule {}
