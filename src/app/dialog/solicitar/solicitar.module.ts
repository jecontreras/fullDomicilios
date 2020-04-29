import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitarPageRoutingModule } from './solicitar-routing.module';

import { SolicitarPage } from './solicitar.page';
import { MapaPageModule } from 'src/app/pages/mapa/mapa.module';
import { ChatDetalladoPageModule } from '../chat-detallado/chat-detallado.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitarPageRoutingModule,
    ChatDetalladoPageModule,
    MapaPageModule
  ],
  declarations: [SolicitarPage]
})
export class SolicitarPageModule {}
