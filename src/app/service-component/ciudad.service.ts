import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { CIUDAD } from '../interfas/sotarage';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  constructor(
    private _model: ServiciosService
  ) { }
  
  get(query: any){
    return this._model.querys<CIUDAD>('ciudad/querys', query, 'post');
  }
  
  editar (query: any){
    return this._model.querys<CIUDAD>('ciudad/'+query.id, query, 'put');
  }

  delete (query: any){
    return this._model.querys<CIUDAD>('ciudad/'+query.id, query, 'delete');
  }

  saved (query: any){
    return this._model.querys<CIUDAD>('ciudad', query, 'post');
  }
}
