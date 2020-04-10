import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { ToolsService } from 'src/app/services/tools.service';
import { ResenaService } from 'src/app/service-component/resena.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.page.html',
  styleUrls: ['./calificacion.page.scss'],
})
export class CalificacionPage implements OnInit {
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
  dataComentario:any = {};
  btndisableComentario:boolean = false;
  data:any = {};

  constructor(
    private modalCtrl: ModalController,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private _resena: ResenaService,
    private navparams: NavParams,
  ) { 

    this._store.subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
    });

  }

  ngOnInit() {
    this.data = this.navparams.get('obj');
    console.log(this.data);
    this.query.where.usuario = this.data.coductor.id;
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
    this._resena.get( this.query ).subscribe((res:any)=>{
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

  submitComentario(){
    let data = this.dataComentario;
    data.creador = this.dataUser.id;
    data.usuario = this.data.coductor.id;
    this.btndisableComentario = true;
    this._resena.saved( data ).subscribe((res:any)=>{
      this._tools.presentToast( "Comentario Agregado" );
      this.dataComentario = {};
      this.btndisableComentario = false;
      this.exit();
    },(error:any) => { this._tools.presentToast(" Error de Servidor "); this.btndisableComentario = false; });
  }


  exit(){
    this.modalCtrl.dismiss();
  }

}
