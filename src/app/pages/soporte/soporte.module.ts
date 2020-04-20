import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoportePageRoutingModule } from './soporte-routing.module';

import { SoportePage } from './soporte.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SoportePageRoutingModule
  ],
  providers: [
    InAppBrowser
  ],
  declarations: [SoportePage]
})
export class SoportePageModule {}
