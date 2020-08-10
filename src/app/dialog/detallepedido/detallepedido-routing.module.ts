import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallepedidoPage } from './detallepedido.page';

const routes: Routes = [
  {
    path: '',
    component: DetallepedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallepedidoPageRoutingModule {}
