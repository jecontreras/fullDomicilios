import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterurbanoPageRoutingModule } from './interurbano-routing.module';

import { InterurbanoPage } from './interurbano.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterurbanoPageRoutingModule
  ],
  declarations: [InterurbanoPage]
})
export class InterurbanoPageModule {}
