import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeguridadPageRoutingModule } from './seguridad-routing.module';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { SeguridadPage } from './seguridad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeguridadPageRoutingModule
  ],
  providers:[
    CallNumber
  ],
  declarations: [SeguridadPage]
})
export class SeguridadPageModule {}
