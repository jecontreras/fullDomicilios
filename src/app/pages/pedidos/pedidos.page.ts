import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ModalController } from '@ionic/angular';
import { DetallepedidoPage } from 'src/app/dialog/detallepedido/detallepedido.page';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  isFiltro:any = [];
  listRow:any = [];
  ev:any = {};
  evScroll:any;
  query:any = {};
  loading:any;

  constructor(
    private _dataServe: DataService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.listRow = this._dataServe.dbs.listPedidos;
  }

  cambios(){

  }

  getRow(){
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

  doRefresh(ev){
    this.ev = ev;
    this.getRow();
    
  }

  loadData(ev){
    //console.log(ev);
    this.evScroll = ev;
    this.query.skip++;
    this.getRow();
  }

  async opendetalles( off:any ){
    const modal = await this.modalCtrl.create({
      component: DetallepedidoPage,
      componentProps: {
        obj: off || {}
      },
    });
    modal.present();
  }

}