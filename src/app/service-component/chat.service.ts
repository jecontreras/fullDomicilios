import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { CHAT } from '../interfas/sotarage';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private _model: ServiciosService
  ) { }
  
  get(query: any){
    return this._model.querys<CHAT>('chat/querys', query, 'post');
  }
  
  editar (query: any){
    return this._model.querys<CHAT>('chat/'+query.id, query, 'put');
  }

  delete (query: any){
    return this._model.querys<CHAT>('chat/'+query.id, query, 'delete');
  }

  saved (query: any){
    return this._model.querys<CHAT>('chat', query, 'post');
  }
}
