import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SugerirRestaurantePage } from './sugerir-restaurante.page';

const routes: Routes = [
  {
    path: '',
    component: SugerirRestaurantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SugerirRestaurantePageRoutingModule {}
