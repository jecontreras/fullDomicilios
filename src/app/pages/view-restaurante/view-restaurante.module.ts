import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewRestaurantePageRoutingModule } from './view-restaurante-routing.module';

import { ViewRestaurantePage } from './view-restaurante.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { DetalleProductoPageModule } from 'src/app/dialog/detalle-producto/detalle-producto.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewRestaurantePageRoutingModule,
    ComponentsModule,
    DetalleProductoPageModule
  ],
  declarations: [ViewRestaurantePage]
})
export class ViewRestaurantePageModule {}
