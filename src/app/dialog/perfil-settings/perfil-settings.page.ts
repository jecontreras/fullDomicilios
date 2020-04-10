import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { ToolsService } from 'src/app/services/tools.service';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { PersonaAction } from 'src/app/redux/app.actions';

@Component({
  selector: 'app-perfil-settings',
  templateUrl: './perfil-settings.page.html',
  styleUrls: ['./perfil-settings.page.scss'],
})
export class PerfilSettingsPage implements OnInit {

  disableBtnEditar:boolean = false;
  data:any = {};
  query:any = {}
  estado:boolean = true;
  cargaBolena: boolean = false;
  domicilioBolena:boolean = false;
  dataUser:any = {};

  constructor(
    private modalCtrl: ModalController,
    private _user: UserService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
  ) { 
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona;
      this.dataUser.estadoDisponible == true ? this.estado = true : this.estado = false;
      this.dataUser.carga === true ? this.cargaBolena =  true : this.cargaBolena = false;
      this.dataUser.domicilio === true ? this.domicilioBolena =  true : this.domicilioBolena = false;
  });
  }

  ngOnInit() {
  }

  guardarCambios(){

  }

  habilitarCarga(){
    this.cargaBolena = !this.cargaBolena;
    let data:any = {
      id: this.dataUser.id,
      carga: this.cargaBolena
    };
    this.actualizarUser( data, 'carga');
  }
  
  cambioEstado(){
    this.estado = !this.estado;
    let data:any = {
      id: this.dataUser.id,
      estadoDisponible: this.estado
    };
    this.actualizarUser( data, 'estado');
  }

  habilitarDomicilio(){
    this.domicilioBolena = !this.domicilioBolena;
    let data:any = {
      id: this.dataUser.id,
      domicilio: this.domicilioBolena
    };
    this.actualizarUser( data, 'domicilio');
  }

  actualizarUser( data:any, opt:string ){
    this._user.update( data ).subscribe(( res:any )=>{
      this.mensajesUser( opt, res);
      let accion = new PersonaAction( res, 'put');
      this._store.dispatch( accion );
    },( error:any )=> console.error( error ));
  }

  mensajesUser( opt:string, res:any){
    if( opt == 'carga'){
      if( res.carga ) { this._tools.presentToast("Activastes la opcion de carga "); }
      else { this._tools.presentToast("Inactivaste la opcion de carga ");  }
    }
    if( opt == 'domicilio'){
      if( res.domicilio ) { this._tools.presentToast("Activastes la opcion de domicilio "); }
      else { this._tools.presentToast("Inactivaste la opcion de domicilio ");  }
    }
    else{
      if( res.estadoDisponible ) this._tools.presentToast("Estado Activo");
      else this._tools.presentToast("Estado Inactivo");
    }
  }


  exit(){
    this.modalCtrl.dismiss(
      {'dismissed': true}
    );
  }

}
