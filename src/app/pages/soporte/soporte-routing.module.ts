import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoportePage } from './soporte.page';
import { AuthService } from 'src/app/services/auth.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthService],
    component: SoportePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoportePageRoutingModule {}
