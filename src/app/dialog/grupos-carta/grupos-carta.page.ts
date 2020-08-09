import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, ActionSheetController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { DetalleProductoPage } from '../detalle-producto/detalle-producto.page';

@Component({
  selector: 'app-grupos-carta',
  templateUrl: './grupos-carta.page.html',
  styleUrls: ['./grupos-carta.page.scss'],
})
export class GruposCartaPage implements OnInit {
  
  listOpcion:any = [];
  dataParams:any = {};
  listRow:any = [];

  constructor(
    private navparams: NavParams,
    private modalCtrl: ModalController,
    private _dataServe: DataService,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    this.listRow = this._dataServe.dbs.articulos;
    this.listOpcion = this._dataServe.dbs.listOpcion;
    this.dataParams = this.navparams.get('obj');
  }

  cambioView( ev:any ){
    let select:any = ev.detail.value;
    if( select == 'Ordenar por Precio') this.openOrdenar();
  }

  async openProducto( obj: any ){
    const modal = await this.modalCtrl.create({
      component: DetalleProductoPage,
      componentProps: { obj },
    });
    modal.present();
  }


  async openOrdenar(){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Ordenar Por',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Ordenar Predeterminado',
        icon: 'swap-vertical-outline',
        handler: () => {
          console.log('Ordenrar');
        }
      }, {
        text: 'Menor distancia',
        icon: 'location-outline',
        handler: () => {
          console.log('distancia');
        }
      }, {
        text: 'Tiempo de envio',
        icon: 'alarm-outline',
        handler: () => {
          console.log('Tiempo de envio');
        }
      }, {
        text: 'Costo de envio',
        icon: 'bicycle-outline',
        handler: () => {
          console.log('Costo envio');
        }
      }, {
        text: 'Cerrar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cerrando');
        }
      }]
    });
    await actionSheet.present();
  }

  exit(){
    this.modalCtrl.dismiss();
  }

}
