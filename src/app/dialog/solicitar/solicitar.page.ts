import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapaPage } from 'src/app/pages/usuarios/mapa/mapa.page';
import { ToolsService } from 'src/app/services/tools.service';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { OrdenesService } from 'src/app/service-component/ordenes.service';
import { WebsocketService } from 'src/app/services/websocket.services';
import { ServicioActivoAction } from 'src/app/redux/app.actions';

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
  }
  
  constructor(
    private modalCtrl: ModalController,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private _orden : OrdenesService,
    private wsServices: WebsocketService,
  ) { 
    this._store.subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
    });
  }

  ngOnInit() {
    this.data.usuario = this.dataUser.id;
  }


  openMapa(opt){
    this.modalCtrl.create({
      component: MapaPage,
      componentProps: {}
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
    this.btnDisabled = true;
    this._tools.presentLoading();
    this._orden.saved(this.data).subscribe((res:any)=>{
      this._tools.dismisPresent();
      this.btnDisabled = false;
      this.procesoMandado( res );
    },(error)=>{ this._tools.presentToast("Error de servidor"); this.btnDisabled = false; this._tools.dismisPresent(); });
  }

  procesoMandado( res:any ){
    this.wsServices.emit("orden-nuevo", res);
    let accion:any = new ServicioActivoAction( res, 'post' );
    this._store.dispatch( accion );
    this._tools.presentToast("Mandado Solicitando");
    this.vista = 'driver';
    setTimeout(()=>{
      this.exit();
    }, 5000)
  }

  exit(){
    this.modalCtrl.dismiss(
      {'dismissed': true}
    );
  }

}
