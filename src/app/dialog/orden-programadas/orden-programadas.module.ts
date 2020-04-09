import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenProgramadasPageRoutingModule } from './orden-programadas-routing.module';

import { OrdenProgramadasPage } from './orden-programadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenProgramadasPageRoutingModule
  ],
  declarations: [OrdenProgramadasPage]
})
export class OrdenProgramadasPageModule {}
