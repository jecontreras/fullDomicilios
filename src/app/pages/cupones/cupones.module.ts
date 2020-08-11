import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuponesPageRoutingModule } from './cupones-routing.module';

import { CuponesPage } from './cupones.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ListCuponesPageModule } from 'src/app/layout/list-cupones/list-cupones.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListCuponesPageModule,
    CuponesPageRoutingModule
  ],
  declarations: [CuponesPage]
})
export class CuponesPageModule {}
