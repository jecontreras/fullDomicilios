import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdenProgramadasPage } from './orden-programadas.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenProgramadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenProgramadasPageRoutingModule {}
