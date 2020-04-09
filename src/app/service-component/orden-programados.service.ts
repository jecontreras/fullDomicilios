import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { ORDENPROGRAMADOS } from '../interfas/sotarage';

@Injectable({
  providedIn: 'root'
})
export class OrdenProgramadosService {

  constructor(
    private _model: ServiciosService
  ) { }
  
  get(query: any){
    return this._model.querys<ORDENPROGRAMADOS>('ordenprogramados/querys', query, 'post');
  }
  
  editar (query: any){
    return this._model.querys<ORDENPROGRAMADOS>('ordenprogramados/'+query.id, query, 'put');
  }

  delete (query: any){
    return this._model.querys<ORDENPROGRAMADOS>('ordenprogramados/'+query.id, query, 'delete');
  }

  saved (query: any){
    return this._model.querys<ORDENPROGRAMADOS>('ordenprogramados', query, 'post');
  }
}
