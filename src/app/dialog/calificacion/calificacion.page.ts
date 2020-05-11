import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { ToolsService } from 'src/app/services/tools.service';
import { ResenaService } from 'src/app/service-component/resena.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.page.html',
  styleUrls: ['./calificacion.page.scss'],
})
export class CalificacionPage implements OnInit {

  dataUser:any = {};
  btndisableComentario:boolean = false;
  data:any = {};
  dataForm:any = {
    valoracion: 5
  };

  constructor(
    private modalCtrl: ModalController,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private _resena: ResenaService,
    private navparams: NavParams,
  ) { 

    this._store.subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
    });

  }

  ngOnInit() {
    this.data = this.navparams.get('obj');
  }

  submitComentario(){
    let data = this.dataForm;
    data.creador = this.dataUser.id;
    data.usuario = this.data.chatDe.id;
    data.ordenes = this.data.ordenes.id;
    this.btndisableComentario = true;
    this._resena.saved( data ).subscribe((res:any)=>{
      this._tools.presentToast( "Comentario Agregado" );
      this.dataForm = { valoracion: 5 };
      this.btndisableComentario = false;
      this.exit();
    },(error:any) => { this._tools.presentToast(" Error de Servidor "); this.btndisableComentario = false; });
  }


  exit(){
    this.modalCtrl.dismiss();
  }

}
