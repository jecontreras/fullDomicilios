import { Component, OnInit } from '@angular/core';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { ToolsService } from 'src/app/services/tools.service';
import { ModalController } from '@ionic/angular';
import { CarritoPage } from 'src/app/dialog/carrito/carrito.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss'],
})
export class MenusComponent implements OnInit {

  listMenu:any = [
    {
      titulo: "Inicio",
      icon: "home-outline"
    },
    {
      titulo: "Buscar",
      icon: "search-outline"
    },
    {
      titulo: "Pedidos",
      icon: "clipboard-outline"
    },
    {
      titulo: "Perfil",
      icon: "person-outline"
    }
  ];
  countCarro:any ={
    precio: 0,
    cantidad: 0
  }
  constructor(
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private modalCtrl: ModalController,
    private Router: Router
  ) { 
    this._store.subscribe((store:any)=>{
         store = store.name;
         if( !store ) return false;
         if( store.carrito ) {
          if( Object.keys( store.carrito ).length > 0 ) this.procesoCarro( store.carrito);
         }
    });

  }

  ngOnInit() {
    console.log( this.countCarro );
  }

  procesoCarro( carrito:any ){
    let precio:number = 0;
    for( let item of carrito ) if( item.precioTotal ) precio+= Number( item.precioTotal );
    this.countCarro = {
      precio: this.convertiendo( precio ),
      cantidad: carrito.length
    };
  }
  
  convertiendo( numero ){
    return this._tools.monedaChange( 3, 2, numero );
  }

  async openCarrito(){
    const modal = await this.modalCtrl.create({
      component: CarritoPage,
      componentProps: {  },
    });
    modal.present();
  }

  cambioView( event:any ){
    let select:any = event.detail.value;
    if ( select == 'Buscar') this.Router.navigate(['/buscar']);
    if( select == "Inicio" ) this.Router.navigate(['/home']);
    if( select == "Pedidos" ) this.Router.navigate(['/pedidos']);
  }

}
