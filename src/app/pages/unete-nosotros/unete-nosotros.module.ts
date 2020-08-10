import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UneteNosotrosPageRoutingModule } from './unete-nosotros-routing.module';

import { UneteNosotrosPage } from './unete-nosotros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UneteNosotrosPageRoutingModule
  ],
  declarations: [UneteNosotrosPage]
})
export class UneteNosotrosPageModule {}
