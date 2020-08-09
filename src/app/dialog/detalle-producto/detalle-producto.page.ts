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
  listDetalles:any = [];

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
    this.listDetalles = [
      {
        titulo: "Elige tu salsa favorita",
        lista:[
          {
            titulo: "teriyaki",
            subtitulo: "",
            id: 3,
            check: false
          },
          {
            titulo: "picante",
            subtitulo: "",
            id: 5,
            check: false
          }
        ]
      },
      {
        titulo: "Elige tu porción",
        lista:[
          {
            titulo: "8 alitas",
            subtitulo: "1 salsa",
            detalle: "$ 12.000",
            id: 1,
            check: false
          },
          {
            titulo: "16 alitas",
            subtitulo: "2 salsa",
            detalle: "$ 22.000",
            id: 2,
            check: false
          }
        ]
      }
    ];
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

  validadorSeleccion(row: any, data:any ){
    for( let item of row.lista ) if( item.id != data.id ) item.check = false;
  }

  async validador(){
    this.data.lisDetalles = [];
    let respuesta:boolean = true;
    for (let row of this.listDetalles ){
      let filtro:any = row.lista.filter( ( item:any )=> item.check == true );
      if ( Object.keys( filtro ).length == 0 ) { respuesta = false; return false }
      else {
        this.data.lisDetalles.push( filtro[0] );
      }
    }
    return respuesta;
  }

  async agregarCarro(){
    let validando:boolean = true;
    if( Object.keys( this.listDetalles ).length > 0 ) validando = await this.validador();
    if( !validando ) return this._tools.presentToast( "!OPP Tenemos Problemas al seleccionar el productos por favor llenar datos requeridos")
    let data = {
      titulo: this.data.titulo,
      descripcion: this.data.descripcion,
      id: this.data.id || 1,
      precio: this.data.precio,
      precioPromo: this.data.precioPromo,
      precioTotal: this.data.precioTotal,
      foto: this.data.foto,
      cantidadAdquirir: this.data.cantidadAdquirir,
      observacionPedido: this.data.observacionPedido || 'nada',
      listDetalles: this.data.lisDetalles
    };
    let result = await this._tools.carroAgregar( data, CarritoAction );
    this._tools.presentToast("Producto Agregado al carrito");
    this.exit();
  }

  exit(){
    this.modalCtrl.dismiss();
  }

}
