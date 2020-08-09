import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GruposCartaPageRoutingModule } from './grupos-carta-routing.module';

import { GruposCartaPage } from './grupos-carta.page';
import { DetalleProductoPageModule } from '../detalle-producto/detalle-producto.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleProductoPageModule,
    GruposCartaPageRoutingModule
  ],
  declarations: [GruposCartaPage]
})
export class GruposCartaPageModule {}
