import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { ORDENES } from '../interfas/sotarage';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  constructor(
    private _model: ServiciosService
  ) { }
  
  get(query: any){
    return this._model.querys<ORDENES>('ordenes/querys', query, 'post');
  }
  
  editar (query: any){
    return this._model.querys<ORDENES>('ordenes/'+query.id, query, 'put');
  }

  delete (query: any){
    return this._model.querys<ORDENES>('ordenes/'+query.id, query, 'delete');
  }

  saved (query: any){
    return this._model.querys<ORDENES>('ordenes', query, 'post');
  }
}
