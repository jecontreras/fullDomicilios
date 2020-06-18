import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpresarialPageRoutingModule } from './empresarial-routing.module';

import { EmpresarialPage } from './empresarial.page';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpresarialPageRoutingModule,
    NgxCurrencyModule
  ],
  declarations: [EmpresarialPage]
})
export class EmpresarialPageModule {}
