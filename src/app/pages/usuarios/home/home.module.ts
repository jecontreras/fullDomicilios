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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MenuPageModule,
    SolicitarPageModule,
    ChatDetalladoPageModule
  ],
  providers: [
    CallNumber
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
