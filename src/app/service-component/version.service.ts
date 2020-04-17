import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { APP, STORAGES } from '../interfas/sotarage';
import { Store } from '@ngrx/store';
import { NameappAction } from '../redux/app.actions';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';
import { VercionPage } from '../dialog/vercion/vercion.page';

const VERCION = environment.vercionApp;

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(
    private _model: ServiciosService,
    private _store: Store<STORAGES>,
    private modalCtrl: ModalController,
  ) {
    let query = {
      where:{
        estado: 0,
        vercion: VERCION
      }
    };
    this.getAppVercion( query ).subscribe(( res:any )=>{
      res = res.data[0];
      if(!res) { this.OpenModalVercion(); return false;}
      let accion = new NameappAction( res, 'post');
      this._store.dispatch( accion );
    });
  }

  getAppVercion( query:any = {} ){
    return this._model.querys<APP>('app/querys', query, 'post');
  }
  OpenModalVercion(){
    this.modalCtrl.create({
      component: VercionPage,
      componentProps: {}
    }).then(modal=>modal.present());
  }
}
