import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GruposCartaPage } from './grupos-carta.page';

const routes: Routes = [
  {
    path: '',
    component: GruposCartaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GruposCartaPageRoutingModule {}
