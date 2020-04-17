import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { APP, STORAGES } from '../interfas/sotarage';
import { Store } from '@ngrx/store';
import { NameappAction } from '../redux/app.actions';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(
    private _model: ServiciosService,
    private _store: Store<STORAGES>,
  ) {
    let query = {
      estado: 0
    };
    this.getAppVercion( query ).subscribe(( res:any )=>{
      res = res.data[0];
      console.log(res);
      if(!res) return false;
      let accion = new NameappAction( res, 'post');
      this._store.dispatch( accion );
    });
  }

  getAppVercion( query:any = {} ){
    return this._model.querys<APP>('userpaquete/querys', query, 'post');
  }
}
