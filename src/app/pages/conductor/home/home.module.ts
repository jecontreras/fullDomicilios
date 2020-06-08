import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { MenuPageModule } from 'src/app/layout/menu/menu.module';
import { CalificacionPageModule } from 'src/app/dialog/calificacion/calificacion.module';
import { SolicitarPageModule } from 'src/app/dialog/solicitar/solicitar.module';
import { ChatDetalladoPageModule } from 'src/app/dialog/chat-detallado/chat-detallado.module';
import { DetallesEmpresarialPageModule } from 'src/app/dialog/detalles-empresarial/detalles-empresarial.module';
import { ChatEmpresarialPageModule } from 'src/app/dialog/chat-empresarial/chat-empresarial.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MenuPageModule,
    SolicitarPageModule,
    CalificacionPageModule,
    ChatDetalladoPageModule,
    DetallesEmpresarialPageModule,
    ChatEmpresarialPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
