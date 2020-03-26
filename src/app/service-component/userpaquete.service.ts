import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { USERPAQUETE } from '../interfas/sotarage';

@Injectable({
  providedIn: 'root'
})
export class UserpaqueteService {

  constructor(
    private _model: ServiciosService
  ) { }
  
  get(query: any){
    return this._model.querys<USERPAQUETE>('userpaquete/querys', query, 'post');
  }
  
  editar (query: any){
    return this._model.querys<USERPAQUETE>('userpaquete/'+query.id, query, 'put');
  }

  delete (query: any){
    return this._model.querys<USERPAQUETE>('userpaquete/'+query.id, query, 'delete');
  }

  saved (query: any){
    return this._model.querys<USERPAQUETE>('userpaquete', query, 'post');
  }
}
