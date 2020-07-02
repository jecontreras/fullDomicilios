import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlatosPageRoutingModule } from './platos-routing.module';

import { PlatosPage } from './platos.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlatosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PlatosPage]
})
export class PlatosPageModule {}
