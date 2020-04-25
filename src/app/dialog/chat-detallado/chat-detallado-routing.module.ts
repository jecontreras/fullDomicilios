import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatDetalladoPage } from './chat-detallado.page';

const routes: Routes = [
  {
    path: '',
    component: ChatDetalladoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatDetalladoPageRoutingModule {}
