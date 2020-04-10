import { Injectable } from '@angular/core';
import { RESENA } from '../interfas/sotarage';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {

  constructor(
    private _model: ServiciosService
  ) { }
  
  get(query: any){
    return this._model.querys<RESENA>('resena/querys', query, 'post');
  }

  getResena(query: any){
    return this._model.querys<RESENA>('resena/informacionRanking', query, 'post');
  }
  
  editar (query: any){
    return this._model.querys<RESENA>('resena/'+query.id, query, 'put');
  }

  delete (query: any){
    return this._model.querys<RESENA>('resena/'+query.id, query, 'delete');
  }

  saved (query: any){
    return this._model.querys<RESENA>('resena', query, 'post');
  }

}
