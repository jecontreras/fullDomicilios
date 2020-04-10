import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalificacionPageRoutingModule } from './calificacion-routing.module';

import { CalificacionPage } from './calificacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalificacionPageRoutingModule
  ],
  declarations: [CalificacionPage]
})
export class CalificacionPageModule {}
