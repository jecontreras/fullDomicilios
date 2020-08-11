import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCuponesPageRoutingModule } from './list-cupones-routing.module';

import { ListCuponesPage } from './list-cupones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports:[
    ListCuponesPage
  ],
  declarations: [ListCuponesPage]
})
export class ListCuponesPageModule {}
