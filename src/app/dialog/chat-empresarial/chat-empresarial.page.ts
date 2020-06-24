import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { ChatService } from 'src/app/service-component/chat.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { WebsocketService } from 'src/app/services/websocket.services';
import { FormatosService } from 'src/app/services/formatos.service';

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

  //booleando
  booleandMSX:boolean = false;

  constructor(
    private navparams: NavParams,
    private modalCtrl: ModalController,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private _chat: ChatService,
    private wsServices: WebsocketService,
    private _formato: FormatosService,
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
    if( this.data.id ) this.data.ofreceCliente = this.data.ordenes.ofreceCliente;
    console.log( this.data )
    this.validandoGet();
    this.escucharSockets();
    //this.formatoViewNumber();
  }

  formatoViewNumber(){
    this.data.ordenes.ofreceCliente = this._formato.monedaChange( 3, 2, this.data.ordenes.ofreceCliente );
  }

  validandoGet(){
    if( !this.data.ordenes ) return false;
    this._chat.get({ where: { ordenes: this.data.ordenes.id }, limit: 1 }).subscribe((res:any)=>{
      res = res.data[0] ;
      if( !res ) { this.validandoChat( res, false ); return false;}
      this.query.where.chat = res.id;
      this.getChatDetallado();
      this.validandoChat( res, true );
    });
  }

  escucharSockets(){

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
      // console.log("**", chat, this.data);
      if( !this.data.chat ) { 
        if( this.booleandMSX ) return false;
        this.booleandMSX = true;
        this.getChatInit();
      }
      else {
        if( this.data.chat.id != chat.chat.id ) return false;
        this.listRow.push( chat );
        this.listRow = _.unionBy( this.listRow || [], chat, 'id');
      }
    });

    this.wsServices.listen('orden-finalizada')
    .subscribe((marcador: any)=> {
      //console.log(marcador, this.data);
      if( this.data.ordenes.id == marcador.id ) this.data.ordenes.estado = marcador.estado;
    });

    this.wsServices.listen('orden-cancelada')
    .subscribe((marcador: any)=> {
      //console.log( marcador, this.data )
      if( !marcador.id ) return false;
      if( marcador.id === this.data.ordenes.id ) { 
        if( this.data.vista == "usuario" ) {
          this.data.coductor = marcador.coductor;
          this.data.ordenes.coductor = marcador.coductor;
        }
        else{
          this._tools.presentAlert({ header: "ESTE MANDADO EMPRESARIAL HA SIDO CANCELADO!" }); 
          this.exit(); 
          return false;
        }
      }
    });

  }

  getChatInit(){
    this._chat.get( { where: { ordenes: this.data.id, 
        or: [
          {
            emisor: this.dataUser.id
          },
          {
            reseptor: this.dataUser.id
          }
        ]
      }, limit: 1 }).subscribe((res:any)=>{
      res = res.data[0];
      if(!res) return false;
      this.query.where.chat = res.id; 
      this.data.chat = res;
      this.getChatDetallado();
      this.booleandMSX = false;
    });
  }

  validandoChat( res, opt:boolean ){
    if( opt ) {
      if( this.dataUser.id == res.emisor.id ) this.chatDe = res.reseptor;
      else this.chatDe = res.emisor;
      this.data.chatDe = this.chatDe;
    }else{
      // console.log(this.data)
      if( this.data.vista == "cliente" ) this.chatDe = this.data.coductor;
      else this.chatDe = this.data.usuario;
    }
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
    // console.log(data);
    if( !data.emisor || !data.reseptor || !data.ordenes ) return this._tools.presentToast("Ay algo mal Por Favor Reiniciar");
    if( this.dataUser.rol.rol == "conductor") data.visto2 = true;
    if( this.dataUser.rol.rol == "usuario") data.visto = true;
    if( this.disableBtnChat ) return false;
    this.disableBtnChat = true;
    this._chat.saved( data ).subscribe((res:any)=>{
      // console.log(res);
      this.disableBtnChat = false;
      this.mensajeTxt = "";
      this.listRow.push(res.data);
      if( !this.query.where.chat ) this.wsServices.emit( 'chat-principal', res);
      this.wsServices.emit( 'chat-nuevo', res.data);
    },(error)=> { this._tools.presentToast("Error de servidor mensaje no enviado"); this.disableBtnChat = false; });
  }


  exit(){
    this.modalCtrl.dismiss(
      {'dismissed': true}
    );
  }

}
