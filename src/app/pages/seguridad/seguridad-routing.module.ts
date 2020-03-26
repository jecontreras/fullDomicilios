import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeguridadPage } from './seguridad.page';
import { AuthService } from 'src/app/services/auth.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthService],
    component: SeguridadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeguridadPageRoutingModule {}
