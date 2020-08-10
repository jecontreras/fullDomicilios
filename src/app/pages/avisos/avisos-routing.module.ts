import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvisosPage } from './avisos.page';

const routes: Routes = [
  {
    path: '',
    component: AvisosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvisosPageRoutingModule {}
