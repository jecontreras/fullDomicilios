import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { MapaPage } from 'src/app/pages/mapa/mapa.page';
import { ToolsService } from 'src/app/services/tools.service';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { OrdenesService } from 'src/app/service-component/ordenes.service';
import { WebsocketService } from 'src/app/services/websocket.services';
import { ServicioActivoAction } from 'src/app/redux/app.actions';
import { ChatDetalladoPage } from '../chat-detallado/chat-detallado.page';
import * as _ from 'lodash';

@Component({
  selector: 'app-solicitar',
  templateUrl: './solicitar.page.html',
  styleUrls: ['./solicitar.page.scss'],
})
export class SolicitarPage implements OnInit {

  data:any = {};
  dataUser:any = {};

  btnDisabled:boolean = false;

  vista:string = 'form';
  sliderOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };
  paramsData:any = {};
  estadoButton:string = "normal";
  
  constructor(
    private modalCtrl: ModalController,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _orden : OrdenesService,
    private wsServices: WebsocketService,
    private navparams: NavParams,
  ) { 
    this._store.subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
    });
  }

  ngOnInit() {
    this.data.usuario = this.dataUser.id;
    this.paramsData = this.navparams.get('obj');
    console.log(this.paramsData)
    if(this.paramsData.vista == "detalles") this.vista = "detalles";
    if( this.paramsData.vista == 'form') if( this.paramsData.id ) this.data = this.paramsData;
    this.escucharSockets();
  }

  escucharSockets(){
    this.wsServices.listen('orden-actualizada')
    .subscribe((marcador: any)=> {
      if( !marcador ) return false;
      if( this.paramsData.id == marcador.id ) this.paramsData = marcador;
    });

    this.wsServices.listen('orden-confirmada')
    .subscribe((marcador: any)=> {
      console.log( marcador, this.paramsData );
      if( !marcador ) return false;
      if( !marcador.coductor ) return false;
      if( marcador.id == this.paramsData.id && ( this.dataUser.id != marcador.coductor.id ) ) { this.estadoButton = "ORDEN YA CONFIRMADA POR OTRO DRIVE"; this.exit(); }
    });

  }
  openMapa( opt, desicion ){
    let params:any = { vista: "origen" };
    if(!desicion) {
      params = this.paramsData;
      params.vista = opt;
    }
    this.modalCtrl.create({
      component: MapaPage,
      componentProps: {
        obj: params
      }
    }).then( async (modal)=>{
      modal.present();
      const { data } = await modal.onWillDismiss();
      let respuesta = data.dismissed;
      if(!respuesta) return false;
      if(opt == 'origen'){
        this.data.origenLat = respuesta.lat;
        this.data.origenLon =respuesta.lon;
      }
      if(opt == 'destino'){
        this.data.destinolat = respuesta.lat;
        this.data.destinoLon =respuesta.lon;
      }
      console.log(data);
    });
  }

  submitMandado(){
    if( !this.data.origenLat || !this.data.origenLon ) return this._tools.presentToast("origen o destino indefinido");
    console.log(this.data);
    this.data.ofreceCliente = "4.00";
    this.btnDisabled = true;
    this._tools.presentLoading();
    if(this.data.id) this.updateMandados();
    else this.guardarMandado();
  }

  guardarMandado(){
    this._orden.saved(this.data).subscribe((res:any)=>{
      this._tools.dismisPresent();
      this.btnDisabled = false;
      this.procesoMandado( res );
    },(error)=>{ this._tools.presentToast("Error de servidor"); this.btnDisabled = false; this._tools.dismisPresent(); });
  }

  updateMandados(){
    this.data = _.omit( this.data, [ 'usuario', 'coductor', 'idOfertando']);
    if(this.data.estado == 3 || this.data.estado == 2) { 
      setTimeout(()=>{this._tools.dismisPresent(); }, 2000);
      this.btnDisabled = false; 
      return this._tools.presentToast("Este mandado ya no se puede editar por que ya esta en proceso");}
    this._orden.editar(this.data).subscribe((res:any)=>{
      this._tools.dismisPresent();
      this.btnDisabled = false;
      this.wsServices.emit("orden-actualizada", res);
      this._tools.presentToast("Mandado Actualizado");
    },(error)=>{ this._tools.presentToast("Error de servidor"); this.btnDisabled = false; this._tools.dismisPresent(); });
  }

  procesoMandado( res:any ){
    this.wsServices.emit("orden-nuevo", res);
    // let accion:any = new ServicioActivoAction( res, 'post' );
    // this._store.dispatch( accion );
    this._tools.presentToast("Mandado Solicitando");
    this.vista = 'driver';
    setTimeout(()=>{
      this.exit();
    }, 5000)
  }

  aceptarOrden( ){
    this.paramsData.chatDe = this.paramsData.usuario;
    this.paramsData.vista = "drive";
    this.paramsData.opt = true;
    this.paramsData.ordenes = this.paramsData;
    this.modalCtrl.create({
      component: ChatDetalladoPage,
      componentProps: {
        obj: this.paramsData
      }
    }).then( async (modal)=>{
      modal.present();
    });
  }

  exit(){
    this.modalCtrl.dismiss(
      {'dismissed': true}
    );
  }

}
