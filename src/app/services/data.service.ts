import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay } from 'rxjs/operators';
import { Componente } from '../interfas/interfaces';
import { ServiciosService } from './servicios.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( 
    private http: HttpClient,
    private _servicio: ServiciosService
  ) { }

  getMenuOpts() {
     return this.http.get<Componente[]>('/assets/data/menu.json');
    //return this._servicio.querys<Component[]>('menu/querys',{},'post');
  }


}
