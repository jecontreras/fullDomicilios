import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesEmpresarialPageRoutingModule } from './detalles-empresarial-routing.module';

import { DetallesEmpresarialPage } from './detalles-empresarial.page';
import { MapaPageModule } from 'src/app/pages/mapa/mapa.module';
import { ChatEmpresarialPageModule } from '../chat-empresarial/chat-empresarial.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesEmpresarialPageRoutingModule,
    ChatEmpresarialPageModule,
    MapaPageModule
  ],
  declarations: [DetallesEmpresarialPage]
})
export class DetallesEmpresarialPageModule {}
