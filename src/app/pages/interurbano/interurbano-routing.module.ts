import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterurbanoPage } from './interurbano.page';
import { AuthService } from 'src/app/services/auth.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthService],
    component: InterurbanoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterurbanoPageRoutingModule {}
