import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { ChatService } from 'src/app/service-component/chat.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { WebsocketService } from 'src/app/services/websocket.services';

@Component({
  selector: 'app-chat-empresarial',
  templateUrl: './chat-empresarial.page.html',
  styleUrls: ['./chat-empresarial.page.scss'],
})
export class ChatEmpresarialPage implements OnInit {
  
  data:any = {};
  paramsData:any = {};
  chatDe:any = {};
  dataUser:any = {};

  //get del chat
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
  //---------------------------------

  //chat crear
  mensajeTxt:string;
  disableBtnChat:boolean = false;
  //---------------------------------

  constructor(
    private navparams: NavParams,
    private modalCtrl: ModalController,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private _chat: ChatService,
    private wsServices: WebsocketService
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
    if( Object.keys(this.data).length > 0 ) this.validandoChat();
    this.validandoGet();
  }

  validandoGet(){
    if( !this.data.ordenes ) return false;
    this._chat.get({ where: { ordenes: this.data.ordenes.id }, limit: 1 }).subscribe((res:any)=>{
      res = res.data[0] ;
      if( !res ) return false;
      this.query.where.chat = res.id;
      this.getChatDetallado();
    });
  }

  validandoChat(){
    if( this.dataUser.id == this.data.coductor.id ) this.chatDe = this.data.usuario;
    else this.chatDe = this.data.coductor;
    if( !this.data.emisor ) return false;
    if( this.dataUser.id == this.data.emisor.id ) this.chatDe = this.data.emisor;
    else this.chatDe = this.data.reseptor;
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
    if(!this.query.where.chat) return false;
    this._chat.getDetallado( this.query ).subscribe((res:any)=> this.dataFormaList( res ) ,(error)=> this._tools.presentToast("Error de servidor"));
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
