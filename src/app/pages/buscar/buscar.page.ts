import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DetalleProductoPage } from 'src/app/dialog/detalle-producto/detalle-producto.page';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {
  
  searchtxt:string;
  listHistorial:any = [];
  listCategorias:any = [];
  view:string = "home";
  view2:string = "restarurante";
  listOpcion:any = [];
  listFiltro:any = [];

  listRow:any = [];
  listPlatos:any = [];
  ev:any = {};
  evScroll:any;
  query:any = {};
  loading:any;


  constructor(
    private _dataServe: DataService,
    private modalCtrl: ModalController,
    private Router: Router
  ) { }

  ngOnInit() {
    this.listCategorias = this._dataServe.dbs.listCocinas;
    this.listHistorial = this._dataServe.dbs.listHistorial;
    this.listOpcion = this._dataServe.dbs.tabsBuscador;
    this.listFiltro = this._dataServe.dbs.listOpcion;
    this.listRow = this._dataServe.dbs.listRestaurante;
    this.listPlatos = this._dataServe.dbs.articulos;
    console.log( this.listPlatos );
  }

  search(){

  }

  cambioView( ev:any ){
    let select:any = ev.detail.value;
    if( select == "Restaurante" ) this.view2 = "restarurante";
    if( select == "Platillos" ) this.view2 = "platillos";
    console.log( this.view2 );
  }

  cambioView2( ev:any ){
    let select:any = ev.detail.value;
  }

  seleccionHist( item ){
    this.view = "buscando";
  }

  async openCategoria( item:any ){
    this.Router.navigate( ['/platos', item.id ] );
  }

  getRow(){
    this.completado();
  }

  getRow2(){
    this.completado();
  }

  completado(){
    if(this.ev){
      if(this.ev.target){
        this.ev.target.complete();
      }
    }
    if( this.evScroll.target ){
      this.evScroll.target.complete()
    }
    if(this.loading) this.loading.dismiss();
  }

  doRefresh( ev:any , opt:string){
    this.ev = ev;
    if( opt == 'resturante') this.getRow();
    if( opt == 'platillos') this.getRow2();
  }

  loadData( ev:any , opt:string ){
    this.evScroll = ev;
    if( opt == 'resturante') { this.query.skip++; this.getRow(); }
    if( opt == 'platillos') { this.query.skip++; this.getRow2(); }
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
