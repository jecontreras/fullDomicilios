import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment, ModalController } from '@ionic/angular';
import { OrdenProgramadosService } from 'src/app/service-component/orden-programados.service';
import { ToolsService } from 'src/app/services/tools.service';
import { Store } from '@ngrx/store';
import { PERSONA } from 'src/app/interfas/sotarage';
import * as _ from 'lodash';
import { OrdenProgramadasPage } from '../../../dialog/orden-programadas/orden-programadas.page';
import { WebsocketService } from 'src/app/services/websocket.services';

@Component({
  selector: 'app-interurbano',
  templateUrl: './interurbano.page.html',
  styleUrls: ['./interurbano.page.scss'],
})
export class InterurbanoPage implements OnInit {

  data:any = {};
  dataUser:any = {};
  listPage:any = ["AGREGAR UN VIAJE","MIS VIAJES"];
  disableView:string = "AGREGAR UN VIAJE";
  query:any = {
    where:{
      estado: 0
    },
    skip: 0
  };

  @ViewChild(IonSegment, {static: false}) segment: IonSegment;
  disableBtnCrear:boolean = false;

  listRow:any = [];
  public ev:any = {};
  public disable_list:boolean = true;
  public evScroll:any = {};  
  listNotificaciones:any = [];

  constructor(
    private _ordenProgramados: OrdenProgramadosService,
    private _tools: ToolsService,
    private _store: Store<PERSONA>,
    private modalCtrl: ModalController,
    private wsServices: WebsocketService
  ) { 
    this._store.subscribe(( store:any )=>{
      store = store.name;
      this.dataUser = store.persona || {};
    });
  }

  ngOnInit() {
    this.data.usuario = this.dataUser.id;
    this.query.where.usuario = this.dataUser.id;
    this.escucharSockets();

    var intervalID = window.setTimeout(()=>{
      this.segment.value = "AGREGAR UN VIAJE";
    }, 200);
  }

  escucharSockets(){
    // marcador-nuevo
    this.wsServices.listen('ofreciendo-orden-programada')
    .subscribe((marcador: any)=> {
       console.log(marcador);
       this.listNotificaciones.push( marcador );
    });

  }
  
  cambioView(ev:any){
    // console.log(ev);
    this.disableView = ev.detail.value;

    if(this.disableView == 'MIS VIAJES') this.getViajesProgramados();
  }

  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.listRow = [];
    this.getViajesProgramados();
  }

  loadData(ev){
    //console.log(ev);
    this.evScroll = ev;
    this.query.skip++;
    this.getViajesProgramados();
  }

  getViajesProgramados(){
    this._tools.presentLoading();
    this._ordenProgramados.get(this.query).subscribe(( res:any )=>{
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

  submitViaje(){
    this.disableBtnCrear = true;
    this._ordenProgramados.saved( this.data ).subscribe((res:any)=>{
      this.disableBtnCrear = false;
      this.data = {};
      this.wsServices.emit( 'orden-programada-creado', res);
      this._tools.presentToast("Orden Programada Crada Exitosamente");
    },( error:any )=> { this._tools.presentToast("Error al crear la orden programada"); this.disableBtnCrear = false; });
  }

  async borrarViaje( obj:any ){
    let data:any = {
      id: obj.id,
      estado: 1
    };
    let accion:any = await this._tools.presentAlertConfirm({ mensaje:"Desear eliminar este Item" })
    console.log(accion);
    if(!accion) return false;
    this._ordenProgramados.editar( data ).subscribe((res:any)=>{
      this.listRow = this.listRow.filter( (row:any)=> row.id !== obj.id );
      this._tools.presentToast("Eliminado Exitosamente");
      this.wsServices.emit( 'orden-programada-eliminada', res);
    },(error:any)=> this._tools.presentToast("Error al Borrar Servicio programado"))
  }

  OpenServicio( item:any ){
    this.modalCtrl.create({
      component: OrdenProgramadasPage,
      componentProps: {
        obj: item
      }
    }).then(modal=>modal.present());
  }

}
