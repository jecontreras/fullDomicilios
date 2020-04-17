import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VercionPageRoutingModule } from './vercion-routing.module';

import { VercionPage } from './vercion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VercionPageRoutingModule
  ],
  declarations: [VercionPage]
})
export class VercionPageModule {}
