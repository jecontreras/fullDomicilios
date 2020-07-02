import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ToolsService } from 'src/app/services/tools.service';
import { CarritoAction } from 'src/app/redux/app.actions';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class DetalleProductoPage implements OnInit {
  data:any = {}; 
  constructor(
    private modalCtrl: ModalController,
    private navparams: NavParams,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.data = this.navparams.get('obj');
    this.data.cantidadAdquirir = 1;
    this.data.precioTotal = this.data.precio;
    this.data.precioTotalForma = this.convertiendo( this.data.precioTotal );
  }

  cantidadAus( opt:string ){
    if( opt == 'menos') {
      this.data.cantidadAdquirir = Number( this.data.cantidadAdquirir-1 );
      if( ( this.data.cantidadAdquirir <- 0 ) || ( this.data.cantidadAdquirir == 0 ) ) this.data.cantidadAdquirir = 1;
    }
    if( opt == 'mas') this.data.cantidadAdquirir++;
    this.data.precioTotal = String( parseFloat( this.data.precio ) * parseFloat( this.data.cantidadAdquirir) );
    this.data.precioTotalForma = this.convertiendo( this.data.precioTotal );
  }

  convertiendo( numero ){
    return this._tools.monedaChange( 3, 2, numero );
  }

  async agregarCarro(){
    let data = {
      titulo: this.data.titulo,
      descripcion: this.data.descripcion,
      id: this.data.id || 1,
      precio: this.data.precio,
      precioPromo: this.data.precioPromo,
      precioTotal: this.data.precioTotal,
      foto: this.data.foto,
      cantidadAdquirir: this.data.cantidadAdquirir,
      observacionPedido: this.data.observacionPedido || 'nada'
    };
    let result = await this._tools.carroAgregar( data, CarritoAction );
    this._tools.presentToast("Producto Agregado al carrito");
    this.exit();
  }

  exit(){
    this.modalCtrl.dismiss();
  }

}
