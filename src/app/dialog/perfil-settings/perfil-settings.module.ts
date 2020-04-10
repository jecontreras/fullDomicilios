import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilSettingsPageRoutingModule } from './perfil-settings-routing.module';

import { PerfilSettingsPage } from './perfil-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilSettingsPageRoutingModule
  ],
  declarations: [PerfilSettingsPage]
})
export class PerfilSettingsPageModule {}
