import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosPageRoutingModule } from './pedidos-routing.module';

import { PedidosPage } from './pedidos.page';
import { DetallepedidoPageModule } from 'src/app/dialog/detallepedido/detallepedido.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosPageRoutingModule,
    DetallepedidoPageModule
  ],
  declarations: [PedidosPage]
})
export class PedidosPageModule {}
