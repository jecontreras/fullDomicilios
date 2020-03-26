import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AyudaPage } from './ayuda.page';
import { AuthService } from 'src/app/services/auth.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthService],
    component: AyudaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AyudaPageRoutingModule {}
