import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlatosPage } from './platos.page';
import { AuthService } from 'src/app/services/auth.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthService],
    component: PlatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatosPageRoutingModule {}
