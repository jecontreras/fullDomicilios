import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilSettingsPage } from './perfil-settings.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilSettingsPageRoutingModule {}
