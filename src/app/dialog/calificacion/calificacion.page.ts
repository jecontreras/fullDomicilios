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

  fotoCalificar:string = "./assets/images/calificar.jpg";

  listNumeros:any = [1,2,3,4,5];

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

  openArticulo( item:any ){

  }

  exit(){
    this.modalCtrl.dismiss();
  }

}
