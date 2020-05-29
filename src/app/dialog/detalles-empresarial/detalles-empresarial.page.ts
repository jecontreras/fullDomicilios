import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ChatDetalladoPage } from '../chat-detallado/chat-detallado.page';
import { MapaPage } from 'src/app/pages/mapa/mapa.page';
import { ChatEmpresarialPage } from '../chat-empresarial/chat-empresarial.page';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';

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

  constructor(
    private navparams: NavParams,
    private modalCtrl: ModalController,
    private _store: Store<STORAGES>,
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
    this.validandoChat();
  }

  validandoChat(){
    if( this.dataUser.id == this.data.coductor.id ) this.chatDe = this.data.usuario;
    else this.chatDe = this.data.coductor;
    if( !this.data.emisor ) return false;
    if( this.dataUser.id == this.data.emisor.id ) this.chatDe = this.data.emisor;
    else this.chatDe = this.data.reseptor;
  }

  openChat(){
    this.data.vista = "cliente";
    this.data.visto = true;
    console.log(this.data)
    this.data.ordenes = this.data;
    this.modalCtrl.create({
      component: ChatEmpresarialPage,
      componentProps: {
        obj: this.data
      }
    }).then( async (modal)=>{
      modal.present();
      await modal.onWillDismiss();
    });
  }

  venUbicacion(){
    this.data.vista = "ver_drive";
    this.data.ordenes = this.data;
    this.data.chatDe = this.chatDe;
    this.modalCtrl.create({
      component: MapaPage,
      componentProps: {
        obj: this.data
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
