import { Injectable } from '@angular/core';
import { PAQUETES } from '../interfas/sotarage';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class PaqueteService {

  constructor(
    private _model: ServiciosService
  ) { }
  
  get(query: any){
    return this._model.querys<PAQUETES>('paquete/querys', query, 'post');
  }
  
  editar (query: any){
    return this._model.querys<PAQUETES>('paquete/'+query.id, query, 'put');
  }

  delete (query: any){
    return this._model.querys<PAQUETES>('paquete/'+query.id, query, 'delete');
  }

  saved (query: any){
    return this._model.querys<PAQUETES>('paquete', query, 'post');
  }

}
