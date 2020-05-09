import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ChatService } from 'src/app/service-component/chat.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { OrdenesService } from 'src/app/service-component/ordenes.service';
import { MapaPage } from 'src/app/pages/mapa/mapa.page';
import { CalificacionPage } from '../calificacion/calificacion.page';
import { OfertandoService } from 'src/app/service-component/ofertando.service';
import { ConfirmarPage } from '../confirmar/confirmar.page';
import { WebsocketService } from 'src/app/services/websocket.services';

@Component({
  selector: 'app-chat-detallado',
  templateUrl: './chat-detallado.page.html',
  styleUrls: ['./chat-detallado.page.scss'],
})
export class ChatDetalladoPage implements OnInit {
  
  data:any = {};
  query:any = {
    where:{
      estado: 0
    },
    sort: 'createdAt ASC',
    skip: 0
  };
  listRow:any = [];

  public ev:any = {};
  public disable_list:boolean = true;
  public evScroll:any = {};
  dataUser:any = {};
  chatDe:any = {};

  disableBtnConfirmar:boolean = false;
  mensajeTxt:string;

  disableBtnChat:boolean = false;
  vista:string;
  listOfertando:any = {};

  constructor(
    private modalCtrl: ModalController,
    private navparams: NavParams,
    private _chat: ChatService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _orden: OrdenesService,
    private _ofertando: OfertandoService,
    private wsServices: WebsocketService,
  ) { 
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona;
      if( this.dataUser ) this.dataUser.celular = this.dataUser.indicativo+this.dataUser.celular;
    });
  }

  ngOnInit() {
    this.data = this.navparams.get('obj');
    this.vista = this.data.vista;
    console.log(this.data);
    this.escucharSockets();
    this.procesoInicial();
    this.getValidacionOrden();
  }

  getValidacionOrden(){
    return new Promise( resolve =>{
      this._orden.get({ where:{ id: this.data.ordenes.id }, limit: 1 }).subscribe(( res:any )=>{
        res = res.data[0];
        if(!res) return resolve(res);
         this.data.ordenes = res;
        resolve(res);
      });
    });
  }

  procesoInicial(){
    if( this.vista == 'cliente') { this.validandoChat(); if( this.data.id ) { this.query.where.chat = this.data.id; this.getChatDetallado(); this.getOfertando({ orden: this.data.ordenes.id, usuario: this.data.emisor.id }); }}
    if( this.vista == 'drive') { 
      if( this.data.chatDe ) { this.chatDe = this.data.chatDe } else this.validandoChat(); 
      //this.data.ordenes = this.data.ordenes;
      if(this.data.opt) this.getChatInit();
      else { this.query.where.chat = this.data.id; this.getChatDetallado();}
      this.getOfertando({ orden: this.data.ordenes.id, usuario: this.dataUser.id });
    }
  } 

  escucharSockets(){
    // orden-nueva

    this.wsServices.listen('chat-principal')
    .subscribe((marcador: any)=> {
      if( !marcador ) return false;
      // console.log(marcador, this.data);
      //funciona en el usuario no hay problemas
      if( this.data.id == marcador.id) {
        this.data.ofertando = marcador.ofertando;
      }
    });

    this.wsServices.listen('orden-actualizada')
    .subscribe((marcador: any)=> {
      if( !marcador ) return false;
      // console.log(marcador);
      if( this.data.ordenes.id == marcador.id ) {
        this.data.ordenes = marcador;
      }
    });

    this.wsServices.listen('chat-nuevo')
    .subscribe((chat: any)=> {
      //console.log("**", chat, this.data, this.query);
      if(chat.reseptor.id !== this.dataUser.id && ( chat.ordenes )) return false;
      if( this.data.id !== chat.chat.id ) {
        if(this.data.opt) this.getChatInit();
        return false;
      }
      this.query.where.chat = chat.id;
      this.listRow.push( chat );
      this.listRow = _.unionBy( this.listRow || [], chat, 'id');
    });
    
    this.wsServices.listen('orden-confirmada')
    .subscribe((ordenes: any)=> {
      if( this.data.ordenes.id != ordenes.id ) return false;
      this.procesandoOrdenConfirmada( ordenes );
    });

    this.wsServices.listen('ofreciendo-nuevo')
    .subscribe((ordenes: any)=> {
      //console.log(ordenes);
      if( ordenes.orden.id == this.data.ordenes.id ) this.getOfertando({ orden: this.data.ordenes.id, usuario: this.chatDe.id });
    });

    this.wsServices.listen('orden-finalizada')
    .subscribe((marcador: any)=> {
      //console.log(marcador, this.data);
      if( this.data.ordenes.id == marcador.id ) this.data.ordenes.estado = marcador.estado;
    });

  }

  procesandoOrdenConfirmada( ordenes:any ){
    this.data.ordenes = ordenes;
    this.data.chatDe = ordenes.usuario;
    this.chatDe = ordenes.usuario;
    if( ordenes.id == this.data.id) if( this.dataUser.id !== ordenes.coductor.id ) this.exit();
  }

  validandoChat(){
    if(this.dataUser.id == this.data.emisor.id) this.chatDe = this.data.reseptor;
    else this.chatDe = this.data.emisor;
    this.data.chatDe = this.chatDe;
    console.log( this.chatDe )
  }

  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.listRow = [];
    this.query.skip = 0;
    this.getChatDetallado();
  }

  loadData(ev){
    //console.log(ev);
    this.evScroll = ev;
    this.query.skip++;
    this.getChatDetallado();
  }

  getOfertando(data:any){
    this._ofertando.get( { where: data, sort: "createdAt DESC", limit: 1 } ).subscribe((res:any)=>{
      res = res.data[0];
      if(!res) return false;
      this.listOfertando = res;
    },(error)=> this._tools.presentToast("Error de conexion"));
  }

  getChatInit(){
    this._chat.get( { where: { ordenes: this.data.id, emisor: this.dataUser.id }, limit: 1 }).subscribe((res:any)=>{
      res = res.data[0];
      if(!res) return false;
      this.query.where.chat = res.id; 
      this.getChatDetallado();
    });
  }

  getChatDetallado(){
    if(!this.query.where.chat) return false;
    // this._tools.presentLoading();
    this._chat.getDetallado( this.query ).subscribe((res:any)=>{
      this.dataFormaList( res );
      // this._tools.dismisPresent();
    },(error)=> this._tools.presentToast("Error de servidor"));
  }

  dataFormaList(res:any){
    this.listRow.push(...res.data );
    this.listRow =_.unionBy(this.listRow || [], this.listRow, 'id');
    if( this.evScroll.target ) this.evScroll.target.complete()
    if(this.ev){
      this.disable_list = true;
      if(this.ev.target){
        this.ev.target.complete();
      }
    }
  }

  openMapaDrive(){
    this.data.vista = "ver_drive";
    this.modalCtrl.create({
      component: MapaPage,
      componentProps: {
        obj: this.data
      }
    }).then( async (modal)=>{
      modal.present();
    });
  }

  async confirmar(){
    let result:any = await this._tools.presentAlertConfirm({ header: "", mensaje: `<h4>${ this.chatDe.nombre } ${ this.chatDe.apellido } ha aceptado el mandado el cobro total por el mandado es de: </br> <span class="colorPrecio">${ ( this.data.ofertando.ofrece || 0 ).toLocaleString('de-DE', { style: 'currency', currency: 'USD' }) } USD</span> </h4>`, confirm: "ACEPTAR", cancel: "CANCELAR" });
    if(!result) return false;
    let data:any = {
      id: this.data.ordenes.id,
      estado: 3,
      origenConductorlat: this.chatDe.latitud,
      origenConductorlon: this.chatDe.longitud,
      ofreceCliente: this.data.ofertando.ofrece,
      ofreceConductor: this.listOfertando.ofrece,
      coductor: this.chatDe.id,
      idOfertando: this.listOfertando.id,
    };
    this.disableBtnConfirmar = true;
    this._orden.editar(data).subscribe((res:any)=>{
      this.disableBtnConfirmar = false;
      this.data.ordenes = res;
      this._tools.presentToast("Exitos mandado Confirmada");
      this.wsServices.emit("orden-confirmada", res);
    },(error)=> { this._tools.presentToast("Error de servidor"); this.disableBtnConfirmar = false; } );
  }

  async ofertandoCliente(){
    this.disableBtnConfirmar = true;
    await this.getValidacionOrden();
    if( this.data.ordenes.estado == 3) { this.disableBtnConfirmar = false; return this._tools.presentToast("Lo sentimos !Esta orden ya esta en proceso con otro drive!"); }
    if( this.data.ordenes.estado == 1) { this.disableBtnConfirmar = false; return this._tools.presentToast("Lo sentimos !Esta orden fue cancelada por el usuario!"); }
    const modal:any = await this.modalCtrl.create({
      component: ConfirmarPage,
      componentProps: {
        obj: this.data
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.procesoInicial();
    this.disableBtnConfirmar = false;
  }

  async FinalizarOrden(){
    let result:any = await this._tools.presentAlertConfirm({ header: "Estas seguro de finalizar mandado", mensaje: `al finalizar mandado se da por mandado finalizado!`});
    if(!result) return false;
    let data:any = {
      id: this.data.ordenes.id,
      estado: 2,
    };
    this.disableBtnConfirmar = true;
    this._orden.editar(data).subscribe((res:any)=>{
      this.disableBtnConfirmar = false;
      this._tools.presentToast("Exitos mandodado finalizado");
      this.wsServices.emit( "orden-finalizada", res);
      this.cambiarEstadoChat();
      this.openCalifacion( res );
      this.data.ordenes = res;
    },(error)=> { this._tools.presentToast("Error de servidor"); this.disableBtnConfirmar = false; } );
  }

  cambiarEstadoChat(){
    let data:any ={
      id: this.data.id,
      estadoOrden: 2
    };
    this._chat.editar(data).subscribe((res:any)=>console.log(res));
  }

  async openCalifacion( res:any ){
    let modal:any = await this.modalCtrl.create({
      component: CalificacionPage,
      componentProps: {
        obj: this.data
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.procesoInicial();
  }

  submitChat(){
    let data:any = {
      text: this.mensajeTxt,
      emisor: this.dataUser.id,
      reseptor: this.chatDe.id,
      ordenes: this.data.ordenes.id
    };
    console.log(data);
    if( !data.emisor || !data.reseptor || !data.ordenes ) return this._tools.presentToast("Ay algo mal Por Favor Reiniciar");
    if( this.disableBtnChat ) return false;
    this.disableBtnChat = true;
    this._chat.saved( data ).subscribe((res:any)=>{
      console.log(res);
      this.disableBtnChat = false;
      this.mensajeTxt = "";
      this.listRow.push(res.data);
      this.wsServices.emit( 'chat-nuevo', res.data);
    },(error)=> { this._tools.presentToast("Error de servidor mensaje no enviado"); this.disableBtnChat = false; });
  }

  exit(){
    this.modalCtrl.dismiss(
      {'dismissed': true}
    );
  }

}
