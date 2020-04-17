import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialPagosPageRoutingModule } from './historial-pagos-routing.module';

import { HistorialPagosPage } from './historial-pagos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialPagosPageRoutingModule
  ],
  declarations: [HistorialPagosPage]
})
export class HistorialPagosPageModule {}
