import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { OFERTANDO } from '../interfas/sotarage';

@Injectable({
  providedIn: 'root'
})
export class OfertandoService {

  constructor(
    private _model: ServiciosService
  ) { }
  
  get(query: any){
    return this._model.querys<OFERTANDO>('ofertando/querys', query, 'post');
  }
  
  editar (query: any){
    return this._model.querys<OFERTANDO>('ofertando/'+query.id, query, 'put');
  }

  delete (query: any){
    return this._model.querys<OFERTANDO>('ofertando/'+query.id, query, 'delete');
  }

  saved (query: any){
    return this._model.querys<OFERTANDO>('ofertando', query, 'post');
  }
}
