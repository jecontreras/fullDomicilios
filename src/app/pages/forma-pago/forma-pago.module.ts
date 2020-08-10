import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormaPagoPageRoutingModule } from './forma-pago-routing.module';

import { FormaPagoPage } from './forma-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormaPagoPageRoutingModule
  ],
  declarations: [FormaPagoPage]
})
export class FormaPagoPageModule {}
