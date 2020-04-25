import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ChatService } from 'src/app/service-component/chat.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { OrdenesService } from 'src/app/service-component/ordenes.service';
import { MapaPage } from 'src/app/pages/usuarios/mapa/mapa.page';

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
    this.modalCtrl.create({
      component: MapaPage,
      componentProps: {
        obj: this.chatDe
      }
    }).then( async (modal)=>{
      modal.present();
    });
  }

  confirmar(){
    let data:any = {

    };
    this.disableBtnConfirmar = true;
    this._orden.editar(data).subscribe((res:any)=>{
      this.disableBtnConfirmar = false;
      this._tools.presentToast("Exitos orden Confirmada");
    },(error)=> { this._tools.presentToast("Error de servidor"); this.disableBtnConfirmar = false; } );
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
