import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatEmpresarialPage } from './chat-empresarial.page';

const routes: Routes = [
  {
    path: '',
    component: ChatEmpresarialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatEmpresarialPageRoutingModule {}
