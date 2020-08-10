import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallepedidoPageRoutingModule } from './detallepedido-routing.module';

import { DetallepedidoPage } from './detallepedido.page';
import { CalificacionPageModule } from '../calificacion/calificacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalificacionPageModule,
    DetallepedidoPageRoutingModule
  ],
  declarations: [DetallepedidoPage]
})
export class DetallepedidoPageModule {}
