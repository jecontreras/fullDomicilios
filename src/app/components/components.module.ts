import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from '../pipe/pipe.module';
import { BuscadorComponent } from './buscador/buscador.component';
import { MenusComponent } from './menus/menus.component';
import { DetallesComponent } from './detalles/detalles.component';



@NgModule({
  entryComponents:[
    BuscadorComponent
  ],
  declarations: [
    HeaderComponent,
    BuscadorComponent,
    MenusComponent,
    DetallesComponent
  ],
  exports: [
    HeaderComponent,
    BuscadorComponent,
    MenusComponent,
    DetallesComponent
  ],
  imports: [ 
    CommonModule,
    IonicModule,
    PipeModule
  ],
})
export class ComponentsModule { }
