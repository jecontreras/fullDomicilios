import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';
import { STORAGES } from 'src/app/interfas/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  
  listCarrito:any = [];
  data:any = {};
  paramasData:any = {};
  
  constructor(
    private modalCtrl: ModalController,
    private navparams: NavParams,
    public actionSheetController: ActionSheetController,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
  ) {
    this._store.subscribe((store:any)=>{
      store = store.name;
      if( !store ) return false;
      if( store.carrito ) {
       if( Object.keys( store.carrito ).length > 0 ) { this.listCarrito = store.carrito; this.procesoCarro(); }
      }
 });
   }

  ngOnInit() {
  }

  procesoCarro( ){
    let precio:number = 0;
    for( let item of this.listCarrito ) { 
      if( item.precioTotal ) precio+= Number( item.precioTotal ); 
      item.precioTotalForm = this.convertiendo( item.precioTotal );
    }
    this.data.subtotal = precio;
    this.data.subtotalForm = this.convertiendo( precio );
    this.data.costoDomicilio = this.paramasData.costoDomicilio || 7000;
    this.data.costoDomicilioForm = this.convertiendo( this.data.costoDomicilio );
    this.data.total = precio + this.data.costoDomicilio;
    this.data.totalForm = this.convertiendo( this.data.total );
  }
  
  convertiendo( numero ){
    return this._tools.monedaChange( 3, 2, numero );
  }

  openArticulo( obj:any ){
    console.log( obj );
    this.exit()
  }

  openMas(){
    this.exit()
  }

  async presentActionSheet( obj:any ) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'caret-forward-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  exit(){
    this.modalCtrl.dismiss();
  }

}
