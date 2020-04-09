import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterurbanoPageRoutingModule } from './interurbano-routing.module';

import { InterurbanoPage } from './interurbano.page';
import { OrdenProgramadasPageModule } from '../../../dialog/orden-programadas/orden-programadas.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterurbanoPageRoutingModule,
    OrdenProgramadasPageModule
  ],
  declarations: [InterurbanoPage]
})
export class InterurbanoPageModule {}
