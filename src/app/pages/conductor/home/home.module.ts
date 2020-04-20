import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { MenuPageModule } from 'src/app/layout/menu/menu.module';
import { MapaPageModule } from '../mapa/mapa.module';
import { PerfilSettingsPageModule } from 'src/app/dialog/perfil-settings/perfil-settings.module';
import { PaquetesPageModule } from 'src/app/dialog/paquetes/paquetes.module';
import { HistorialPagosPageModule } from 'src/app/dialog/historial-pagos/historial-pagos.module';
import { CalificacionPageModule } from 'src/app/dialog/calificacion/calificacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MenuPageModule,
    MapaPageModule,
    PerfilSettingsPageModule,
    PaquetesPageModule,
    HistorialPagosPageModule,
    CalificacionPageModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
