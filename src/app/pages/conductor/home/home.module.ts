import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { MenuPageModule } from 'src/app/layout/menu/menu.module';
import { MapaPageModule } from '../mapa/mapa.module';
import { PerfilSettingsPageModule } from 'src/app/dialog/perfil-settings/perfil-settings.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MenuPageModule,
    MapaPageModule,
    PerfilSettingsPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
