import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalificacionPage } from './calificacion.page';

const routes: Routes = [
  {
    path: '',
    component: CalificacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalificacionPageRoutingModule {}
