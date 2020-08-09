import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarPageRoutingModule } from './buscar-routing.module';

import { BuscarPage } from './buscar.page';
import { DetalleProductoPageModule } from 'src/app/dialog/detalle-producto/detalle-producto.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarPageRoutingModule,
    DetalleProductoPageModule,
    ComponentsModule
  ],
  declarations: [BuscarPage]
})
export class BuscarPageModule {}
