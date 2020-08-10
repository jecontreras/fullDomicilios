import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormaPagoPage } from './forma-pago.page';

const routes: Routes = [
  {
    path: '',
    component: FormaPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormaPagoPageRoutingModule {}
