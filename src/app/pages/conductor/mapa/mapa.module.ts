import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaPageRoutingModule } from './mapa-routing.module';

import { MapaPage } from './mapa.page';
import { PaquetesPageModule } from 'src/app/dialog/paquetes/paquetes.module';
import { CallNumber } from '@ionic-native/call-number/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaPageRoutingModule,
    PaquetesPageModule
  ],
  providers: [
    CallNumber
  ],
  exports: [
    MapaPage
  ],
  declarations: [MapaPage]
})
export class MapaPageModule {}
