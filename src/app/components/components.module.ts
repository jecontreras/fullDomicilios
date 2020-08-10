import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from '../pipe/pipe.module';
import { BuscadorComponent } from './buscador/buscador.component';
import { MenusComponent } from './menus/menus.component';
import { DetallesComponent } from './detalles/detalles.component';
import { ListCuponesComponent } from './list-cupones/list-cupones.component';



@NgModule({
  entryComponents:[
    BuscadorComponent
  ],
  declarations: [
    HeaderComponent,
    BuscadorComponent,
    MenusComponent,
    DetallesComponent,
    ListCuponesComponent
  ],
  exports: [
    HeaderComponent,
    BuscadorComponent,
    MenusComponent,
    DetallesComponent,
    ListCuponesComponent
  ],
  imports: [ 
    CommonModule,
    IonicModule,
    PipeModule,
  ],
})
export class ComponentsModule { }
