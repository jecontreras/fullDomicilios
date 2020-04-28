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
    sort: 'createdAt DESC',
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

  constructor(
    private modalCtrl: ModalController,
    private navparams: NavParams,
    private _chat: ChatService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _orden: OrdenesService
  ) { 
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona;
      if( this.dataUser ) this.dataUser.celular = this.dataUser.indicativo+this.dataUser.celular;
  });
  }

  ngOnInit() {
    this.data = this.navparams.get('obj');
    console.log(this.data);
    this.validandoChat();
    if(this.data.id) this.getChatDetallado();
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

  getChatDetallado(){
    this.query.where.chat = this.data.id;
    this._tools.presentLoading();
    this._chat.getDetallado( this.query ).subscribe((res:any)=>{
      this.dataFormaList( res );
      this._tools.dismisPresent();
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
    let result:any = await this._tools.presentAlertConfirm({ header: "", mensaje: `<h4>${ this.chatDe.nombre } ${ this.chatDe.apellido } ha aceptado el mandado el cobro total por el mandado es de: </br> <span class="colorPrecio">${ ( this.data.ofertando.ofrece || 0 ).toLocaleString(1) } USD</span> </h4>`, confirm: "ACEPTAR", cancel: "CANCELAR" });
    if(!result) return false;
    let data:any = {
      id: this.data.ordenes.id,
      estado: 3,
      origenConductorlat: this.chatDe.latitud,
      origenConductorlon: this.chatDe.longitud,
      ofreceCliente: this.data.ofertando.ofrece,
      ofreceConductor: this.data.ordenes.ofreceCliente,
      coductor: this.chatDe.id,
      idOfertando: this.data.ofertando.id,
    };
    this.disableBtnConfirmar = true;
    this._orden.editar(data).subscribe((res:any)=>{
      this.disableBtnConfirmar = false;
      this.data.ordenes = res;
      this._tools.presentToast("Exitos mandado Confirmada");
    },(error)=> { this._tools.presentToast("Error de servidor"); this.disableBtnConfirmar = false; } );
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
      this.cambiarEstadoChat();
      this.openCalifacion( res );
    },(error)=> { this._tools.presentToast("Error de servidor"); this.disableBtnConfirmar = false; } );
  }

  cambiarEstadoChat(){
    let data:any ={
      id: this.data.id,
      estadoOrden: 1
    };
    this._chat.editar(data).subscribe((res:any)=>console.log(res));
  }

  openCalifacion( res:any ){
    this.modalCtrl.create({
      component: CalificacionPage,
      componentProps: {
        obj: this.data
      }
    }).then( async (modal)=>{
      modal.present();
    });
  }

  submitChat(){
    let data:any = {
      text: this.mensajeTxt,
      emisor: this.dataUser.id,
      reseptor: this.chatDe.id,
      ordenes: this.data.ordenes.id
    };
    if( !data.emisor || !data.reseptor || !data.ordenes ) return this._tools.presentToast("Ay algo mal Por Favor Reiniciar");
    if( this.disableBtnChat ) return false;
    this.disableBtnChat = true;
    this._chat.saved( data ).subscribe((res:any)=>{
      this.disableBtnChat = false;
      this.mensajeTxt = "";
      this.listRow.push(res.data);
    },(error)=> { this._tools.presentToast("Error de servidor mensaje no enviado"); this.disableBtnChat = false; });
  }

  exit(){
    this.modalCtrl.dismiss(
      {'dismissed': true}
    );
  }

}
