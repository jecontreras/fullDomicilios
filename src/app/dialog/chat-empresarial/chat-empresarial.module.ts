import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatEmpresarialPageRoutingModule } from './chat-empresarial-routing.module';

import { ChatEmpresarialPage } from './chat-empresarial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatEmpresarialPageRoutingModule
  ],
  declarations: [ChatEmpresarialPage]
})
export class ChatEmpresarialPageModule {}
