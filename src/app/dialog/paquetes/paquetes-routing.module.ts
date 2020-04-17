import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaquetesPage } from './paquetes.page';

const routes: Routes = [
  {
    path: '',
    component: PaquetesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaquetesPageRoutingModule {}
