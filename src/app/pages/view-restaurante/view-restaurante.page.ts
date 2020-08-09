import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetalleProductoPage } from 'src/app/dialog/detalle-producto/detalle-producto.page';
import { ToolsService } from 'src/app/services/tools.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-view-restaurante',
  templateUrl: './view-restaurante.page.html',
  styleUrls: ['./view-restaurante.page.scss'],
})
export class ViewRestaurantePage implements OnInit {
  
  restaurante:string = "";
  data:any = {};
  id:any = "";
  vista:string = "home";

  constructor(
    private modalCtrl: ModalController,
    private _tools: ToolsService,
    private _dataServe: DataService
  ) { }

  ngOnInit() {
    this.data = this._dataServe.dbs;
    this.data.domicilio.precioForma = this.convertiendo( this.data.domicilio.precio );
  }

  convertiendo( numero ){
    return this._tools.monedaChange( 3, 2, numero );
  }

  async openProducto( obj:any ){
    console.log( obj );
    const modal = await this.modalCtrl.create({
      component: DetalleProductoPage,
      componentProps: { obj },
    });
    modal.present();
  }
  

}
