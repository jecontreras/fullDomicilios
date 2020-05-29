import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesEmpresarialPage } from './detalles-empresarial.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesEmpresarialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesEmpresarialPageRoutingModule {}
