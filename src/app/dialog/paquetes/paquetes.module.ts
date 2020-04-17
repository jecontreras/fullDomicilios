import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaquetesPageRoutingModule } from './paquetes-routing.module';

import { PaquetesPage } from './paquetes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaquetesPageRoutingModule
  ],
  declarations: [PaquetesPage]
})
export class PaquetesPageModule {}
