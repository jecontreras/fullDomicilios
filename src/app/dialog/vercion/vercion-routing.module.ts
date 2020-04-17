import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VercionPage } from './vercion.page';

const routes: Routes = [
  {
    path: '',
    component: VercionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VercionPageRoutingModule {}
