import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SugerirRestaurantePageRoutingModule } from './sugerir-restaurante-routing.module';

import { SugerirRestaurantePage } from './sugerir-restaurante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SugerirRestaurantePageRoutingModule
  ],
  declarations: [SugerirRestaurantePage]
})
export class SugerirRestaurantePageModule {}
