import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ChatDetalladoPage } from '../chat-detallado/chat-detallado.page';
import { MapaPage } from 'src/app/pages/mapa/mapa.page';
import { ChatEmpresarialPage } from '../chat-empresarial/chat-empresarial.page';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { ToolsService } from 'src/app/services/tools.service';
import { OrdenesService } from 'src/app/service-component/ordenes.service';
import * as _ from 'lodash';
import { FormatosService } from 'src/app/services/formatos.service';
import { WebsocketService } from 'src/app/services/websocket.services';
import { ChatService } from 'src/app/service-component/chat.service';
import { ChatFinixAction } from 'src/app/redux/app.actions';

@Component({
  selector: 'app-detalles-empresarial',
  templateUrl: './detalles-empresarial.page.html',
  styleUrls: ['./detalles-empresarial.page.scss'],
})
export class DetallesEmpresarialPage implements OnInit {
  
  paramsData:any = {};
  data:any = {};
  dataUser:any = {};
  chatDe:any = {};

  disableBtnFinalizar:boolean = false;

  constructor(
    private navparams: NavParams,
    private modalCtrl: ModalController,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private _ordenes: OrdenesService,
    private _formato: FormatosService,
    private wsServices: WebsocketService,
    private _chat: ChatService
  ) {
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona;
      if( this.dataUser ) this.dataUser.celular = this.dataUser.indicativo+this.dataUser.celular;
    });
  }

  ngOnInit() {
    this.paramsData = this.navparams.get('obj');
    this.data = this.paramsData || {};
    if( this.data.estado == 2 ) this.disableBtnFinalizar = true;
    console.log(this.data);
    this.validandoChat();
    this.formatoViewNumber();
    this.escucharSockets();
  }

  escucharSockets(){
    this.wsServices.listen('orden-finalizada')
    .subscribe((marcador: any)=> {
      //console.log(marcador);
      if( !marcador ) return false;
      if( marcador.id != this.data.id ) return false;
      this.data.estado = marcador.estado;
      if( this.data.estado == 2 ) this.disableBtnFinalizar = true;
    });
    this.wsServices.listen('orden-finalizada')
    .subscribe((marcador: any)=> {
      if( this.data.id == marcador.id ){
        this.data.horaEntrega = marcador.horaEntrega;
        this.data.nombreCliente = marcador.nombreCliente;
        this.data.numeroCliente = marcador.numeroCliente;
        this.data.ofreceCliente = marcador.ofreceCliente;
        this.data.origenLat = marcador.origenLat;
        this.data.origenLon = marcador.origenLon;
        this.data.origentexto = marcador.origentexto;
        
      }
    });
  }

  validandoChat(){
    if( !this.data.coductor ){ this.disableBtnFinalizar = true; return false;}
    if( this.dataUser.id == this.data.coductor.id ) this.chatDe = this.data.usuario;
    else this.chatDe = this.data.coductor;
    if( !this.data.emisor ) return false;
    if( this.dataUser.id == this.data.emisor.id ) this.chatDe = this.data.emisor;
    else this.chatDe = this.data.reseptor;
  }

  formatoViewNumber(){
    //this.data.ofreceCliente = this._formato.monedaChange( 3, 2, this.data.ofreceCliente );
  }

  openChat(){
    let data:any = _.clone(this.data);
    if(this.dataUser.rol.rol == 'conductor') data.vista = "conductor";
    else data.vista = "cliente";
    data.visto = true;
    data.ordenes = data;
    this.modalCtrl.create({
      component: ChatEmpresarialPage,
      componentProps: {
        obj: data
      }
    }).then( async (modal)=>{
      modal.present();
      await modal.onWillDismiss();
    });
  }

  venUbicacion(){
    let data:any = _.clone(this.data);
    data.vista = "ver_drive";
    data.ordenes = data;
    data.chatDe = this.chatDe;
    this.modalCtrl.create({
      component: MapaPage,
      componentProps: {
        obj: data
      }
    }).then( async (modal)=>{
      modal.present();
    });
  }

  async finalizarServicio(){
    let result:any = await this._tools.presentAlertConfirm({ header: "¿Estas seguro que ya completaste el mandado empresarila?", mensaje: ``, cancel: "NO", confirm: "SI"});
    if(!result) return false;
    let data:any = {
      id: this.data.id,
      estado: 2
    };
    this.disableBtnFinalizar = true;
    this._ordenes.editar(data).subscribe((res:any)=>this.ProcesoFinalizar(res),(error)=> { this.disableBtnFinalizar = false; this._tools.presentToast("Error por favor intentarlo de nuevo") } );
  }

  async ProcesoFinalizar( res:any ){
    this.disableBtnFinalizar = false;
    this.wsServices.emit( "orden-finalizada", res);
    this.cambiarEstadoChat();
    await this._tools.presentAlert({ header: "¡BIEN HECHO! COMPLETASTE EL MANDADO" });
    this.exit( false );
  }
  
  async ChatInit(){
    return new Promise(resolve=>{
      this._chat.get({ where: { ordenes: this.data.id }, limit: 1 }).subscribe((res:any)=>{
        res = res.data[0] ;
        if( !res ) return resolve(false);
        else resolve( res );
      });
    })
  }

  async cambiarEstadoChat(){
    let chat:any = await this.ChatInit();
    if(!chat) return false;
    let data:any ={
      id: chat.id,
      estadoOrden: 2,
      visto: true,
      visto2: true
    };
    this._chat.editar(data).subscribe((res:any)=>{
      console.log(res);
      let accion:any = new ChatFinixAction( res, 'post');
      this._store.dispatch( accion );
    });
  }

  exit( opt:boolean = true ){
    this.modalCtrl.dismiss(
      {'dismissed': opt }
    );
  }

}
