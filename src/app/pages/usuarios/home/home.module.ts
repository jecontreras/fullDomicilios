import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { MenuPageModule } from 'src/app/layout/menu/menu.module';
import { CalificacionPageModule } from 'src/app/dialog/calificacion/calificacion.module';
import { CallNumber } from '@ionic-native/call-number/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MenuPageModule,
    CalificacionPageModule
  ],
  providers: [
    CallNumber
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
