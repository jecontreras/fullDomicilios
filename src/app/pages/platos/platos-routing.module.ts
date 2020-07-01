import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlatosPage } from './platos.page';

const routes: Routes = [
  {
    path: '',
    component: PlatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatosPageRoutingModule {}
