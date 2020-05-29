import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { OrdenesService } from 'src/app/service-component/ordenes.service';
import { ToolsService } from 'src/app/services/tools.service';
import { WebsocketService } from 'src/app/services/websocket.services';
import { STORAGES } from 'src/app/interfas/sotarage';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { FormatosService } from 'src/app/services/formatos.service';

@Component({
  selector: 'app-empresarial',
  templateUrl: './empresarial.page.html',
  styleUrls: ['./empresarial.page.scss'],
})
export class EmpresarialPage implements OnInit {
  
  data:any = {};
  vista:string = "crear";
  paramsData:any = {};
  btnDisabled:boolean = false;
  dataUser:any = {};

  vandera:boolean = true;
  numeroIntegrado:number = 0;
  vanderaNumber:boolean = false;
  
  constructor(
    private modalCtrl: ModalController,
    private navparams: NavParams,
    private _orden: OrdenesService,
    private _tools: ToolsService,
    private wsServices: WebsocketService,
    private _store: Store<STORAGES>,
    private _formato: FormatosService
  ) {
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona || {};
    });
  }

  ngOnInit() {
    this.paramsData = this.navparams.get('obj');
    this.vista = this.paramsData.vista;
    if( this.paramsData.vista = "update") this.data = this.paramsData;

  }
  
  estadoNumber(opt){
    if(opt) this.data.ofreceCliente = this.numeroIntegrado;
    this.numeroIntegrado = Number( this.data.ofreceCliente || 0 );
    this.vanderaNumber = false;
  }

  formatoNumber( opt:boolean = false ){
    if(!opt) { this.estadoNumber(false); this.data.ofreceCliente = this._formato.monedaChange( 3, 2, this.data.ofreceCliente); this.vanderaNumber = true;}
  }

  BlurNumber(){
    if( this.vanderaNumber ) return false;
    this.formatoNumber();
  }

  submitMandado(){
    this.btnDisabled = true;
    if(this.vista == "crear") this.guardarMandado();
    if(this.vista == "update") this.updateMandado();
  }

  guardarMandado(){
    this.data.usuario = this.dataUser.id;
    this.data.origenLat = this.dataUser.latitud;
    this.data.origenLon = this.dataUser.longitud;
    this.data.tipoOrden = 1;
    this._orden.saved(this.data).subscribe((res:any)=>{
      this._tools.dismisPresent();
      this.btnDisabled = false;
      this.procesoMandado( res );
    },(error)=>{ this._tools.presentToast("Error de al crear"); this.btnDisabled = false; this._tools.dismisPresent(); });
  }

  updateMandado(){
    this.data = _.omit( this.data, [ 'usuario', 'coductor', 'idOfertando']);
    if(this.data.estado == 3 || this.data.estado == 2) { 
      setTimeout(()=>{this._tools.dismisPresent(); }, 2000);
      this.btnDisabled = false; 
      return this._tools.presentToast("Este mandado empresarial ya no se puede editar por que ya esta en proceso");}
    this._orden.editar(this.data).subscribe((res:any)=>{
      this._tools.dismisPresent();
      this.btnDisabled = false;
      this.wsServices.emit("orden-actualizada", res);
      this._tools.presentToast("Mandado Empresarial Actualizado");
    },(error)=>{ this._tools.presentToast("Error al actualizar"); this.btnDisabled = false; this._tools.dismisPresent(); });
  }

  procesoMandado( res:any ){
    this.wsServices.emit("orden-nuevo", res);
    this.vista = "completado";
    // let accion:any = new ServicioActivoAction( res, 'post' );
    // this._store.dispatch( accion );
    this._tools.presentToast("Mandado Empresarial Solicitando");
    setTimeout(()=>{
      this.exit();
    }, 3000)
  }

  exit(){
    this.modalCtrl.dismiss();
  }

}
