import { Component, OnInit } from '@angular/core';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { ChatService } from 'src/app/service-component/chat.service';
import { OfertandoService } from 'src/app/service-component/ofertando.service';
import { NavParams, ModalController } from '@ionic/angular';
import { ToolsService } from 'src/app/services/tools.service';
import { WebsocketService } from 'src/app/services/websocket.services';

@Component({
  selector: 'app-confirmar',
  templateUrl: './confirmar.page.html',
  styleUrls: ['./confirmar.page.scss'],
})
export class ConfirmarPage implements OnInit {

  opcion:string = "home";
  data:any = {
    precio: "4.00"
  };
  dataUser:any = {};
  dataPararm:any = {};

  btnDisabled:boolean = false;

  constructor(
    private _store: Store<STORAGES>,
    private _chat: ChatService,
    private _ofertando: OfertandoService,
    private navparams: NavParams,
    private _tools: ToolsService,
    private modalCtrl: ModalController,
    private wsServices: WebsocketService,
  ) {
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona;
  });
  }

  ngOnInit() {
    this.dataPararm = this.navparams.get('obj');
    console.log( this.dataPararm );
  }

  tipoMandado( opt:string, disable:boolean ){
    if( !disable ) this.data.precio = "4.00";
    this.opcion = opt;
  }

  confirmar(){  
    let dataOferta:any = {
      "usuario": this.dataUser.id,
      "orden": this.dataPararm.id,
      "ofrece": this.data.precio,
      "descripcion": "init"
    };

    this._ofertando.saved( dataOferta ).subscribe((res)=>{
      this.Procesoconfirmar(res);
      this.btnDisabled = true;
    },(error)=> { this.btnDisabled = true; this._tools.presentToast("Error de servidor"); });
  }

  Procesoconfirmar( res:any ){
    let data:any = {
      "emisor": this.dataUser.id,
      "reseptor": this.dataPararm.chatDe.id,
      "text": "Hola, buenos dias, solo quiero confirmar el numero de casa de la dirección de entrega",
      "ordenes": this.dataPararm.id,
      "ofertando": res.id
    };
    this._chat.saved(data).subscribe((res:any)=>{ 
      res = res.data; 
      this.getChatInit(res);
      this.exit()
    },(error)=>{ this._tools.presentToast("Error de servidor")});
  }

  getChatInit(res:any){
    this._chat.get({ where: { id: res.chat.id }, limit: 1}).subscribe((res:any)=>{
      res = res.data[0];
      if(!res) return false;
      this.wsServices.emit( 'chat-principal', res);
    });
  }

  exit(){
    this.modalCtrl.dismiss(
      {'dismissed': true}
    );
  }

}
