import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewRestaurantePageRoutingModule } from './view-restaurante-routing.module';

import { ViewRestaurantePage } from './view-restaurante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewRestaurantePageRoutingModule
  ],
  declarations: [ViewRestaurantePage]
})
export class ViewRestaurantePageModule {}
