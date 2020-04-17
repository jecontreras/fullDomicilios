import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialPagosPage } from './historial-pagos.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialPagosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialPagosPageRoutingModule {}
