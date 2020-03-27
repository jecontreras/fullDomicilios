import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaPage } from './carga.page';
import { AuthService } from 'src/app/services/auth.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthService],
    component: CargaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CargaPageRoutingModule {}
