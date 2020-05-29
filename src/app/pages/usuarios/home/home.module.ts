import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { MenuPageModule } from 'src/app/layout/menu/menu.module';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SolicitarPageModule } from 'src/app/dialog/solicitar/solicitar.module';
import { ChatDetalladoPageModule } from 'src/app/dialog/chat-detallado/chat-detallado.module';
import { EmpresarialPageModule } from 'src/app/dialog/empresarial/empresarial.module';
import { DetallesEmpresarialPageModule } from 'src/app/dialog/detalles-empresarial/detalles-empresarial.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MenuPageModule,
    SolicitarPageModule,
    ChatDetalladoPageModule,
    EmpresarialPageModule,
    DetallesEmpresarialPageModule
  ],
  providers: [
    CallNumber
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
