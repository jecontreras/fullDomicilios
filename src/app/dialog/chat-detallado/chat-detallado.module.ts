import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatDetalladoPageRoutingModule } from './chat-detallado-routing.module';

import { ChatDetalladoPage } from './chat-detallado.page';
import { MapaPageModule } from 'src/app/pages/mapa/mapa.module';
import { CalificacionPageModule } from '../calificacion/calificacion.module';
import { ConfirmarPageModule } from '../confirmar/confirmar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaPageModule,
    ChatDetalladoPageRoutingModule,
    CalificacionPageModule,
    ConfirmarPageModule
  ],
  declarations: [ChatDetalladoPage]
})
export class ChatDetalladoPageModule {}
