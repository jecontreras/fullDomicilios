import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { DEPARTAMENTO } from '../interfas/sotarage';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  constructor(
    private _model: ServiciosService
  ) { }
  
  get(query: any){
    return this._model.querys<DEPARTAMENTO>('departamento/querys', query, 'post');
  }
  
  editar (query: any){
    return this._model.querys<DEPARTAMENTO>('departamento/'+query.id, query, 'put');
  }

  delete (query: any){
    return this._model.querys<DEPARTAMENTO>('departamento/'+query.id, query, 'delete');
  }

  saved (query: any){
    return this._model.querys<DEPARTAMENTO>('departamento', query, 'post');
  }
}
