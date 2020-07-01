import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewRestaurantePage } from './view-restaurante.page';

const routes: Routes = [
  {
    path: '',
    component: ViewRestaurantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewRestaurantePageRoutingModule {}
