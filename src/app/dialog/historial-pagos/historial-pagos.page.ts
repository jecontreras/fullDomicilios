import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { PaqueteService } from 'src/app/service-component/paquete.service';
import * as _ from 'lodash';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-historial-pagos',
  templateUrl: './historial-pagos.page.html',
  styleUrls: ['./historial-pagos.page.scss'],
})
export class HistorialPagosPage implements OnInit {

  dataUser:any = {};
  listRow:any = [];
  query:any = {
    where:{
      estado: 0
    },
    skip: 0
  };

  public ev:any = {};
  public disable_list:boolean = true;
  public evScroll:any = {};

  constructor(
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private _pago: PaqueteService,
    private modalCtrl: ModalController,
  ) {
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona;
    });
  }

  ngOnInit() {
    this.query.where.usuario = this.dataUser.id;
    this.getList();
  }

  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.listRow = [];
    this.getList();
  }

  loadData(ev){
    //console.log(ev);
    this.evScroll = ev;
    this.query.skip++;
    this.getList();
  }

  getList(){
    this._tools.presentLoading();
    this._pago.getUser( this.query ).subscribe((res:any)=>{
      this.dataFormaList(res);
      this._tools.dismisPresent();
    });
  }

  dataFormaList(res:any){
    this.listRow.push(...res.data );
    this.listRow =_.unionBy(this.listRow || [], res.data, 'id');
    if( this.evScroll.target ){
      this.evScroll.target.complete()
    }
    if(this.ev){
      this.disable_list = true;
      if(this.ev.target){
        this.ev.target.complete();
      }
    }
    this._tools.dismisPresent();
  }

  exit(){
    this.modalCtrl.dismiss(
      {'dismissed': true}
    );
  }

}
