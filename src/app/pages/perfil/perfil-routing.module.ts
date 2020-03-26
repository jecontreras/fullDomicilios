import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilPage } from './perfil.page';
import { AuthService } from 'src/app/services/auth.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthService],
    component: PerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPageRoutingModule {}
