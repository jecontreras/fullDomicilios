import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { STORAGES } from '../interfas/sotarage';
import { Store } from '@ngrx/store';
import { PersonaAction } from '../redux/app.actions';

export interface MapboxOutput {
  attribution: string;
  features: Feature[];
  query: [];
}

export interface Feature {
  place_name: string;
}

export interface sear_ruta {
  routes: [];
  waypoints: [];
  code: string;
  uuid: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  dataUser:any = {};

  constructor(
    private http: HttpClient,
    private _user: UserService,
    private _store: Store<STORAGES>,
    ) { 
      this._store
      .subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
      });
    }

  search_wordLngLat(query: string) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    // return this.http.get(url + query + '.json?types=region&access_token='
    return this.http.get(url + query + '.json?language=es&access_token='
    + environment.mapbox.accessTokens)
    .pipe(map((res: MapboxOutput) => {
      let data:any = res.features[0];
      let info:any = {
        pais: data.context[1].text,
        departamento: data.context[0].text,
        ciudad: data.text,
        direccion: data.place_name
      };
      this.updateUser( info );
      return res.features;
    }));
  }

  updateUser( query ){
    let data:any = {
      id: this.dataUser.id,
      pais: query.pais,
      departamento: query.departamento,
      ciudad: query.ciudad,
      direccion: query.direccion
    };
    this._user.update( data ).subscribe(( res:any )=>{
      console.log( res );
      let accion = new PersonaAction( res, 'post');
      this._store.dispatch( accion );
    });
  }

  search_word(query: string, lat:number, lon:number) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    // return this.http.get(url + query + '.json?types=region&access_token='
    return this.http.get(url + query + `.json?proximity=${ lon },${ lat }&language=es&region=Colombia&access_token=`
    + environment.mapbox.accessTokens)
    .pipe(map((res: MapboxOutput) => {
      return res.features;
    }));
  }

  search_ruta(query:any){
    let url = `https://api.mapbox.com/directions/v5/mapbox/driving/`+encodeURIComponent(`${ query.origenlon },${ query.origenlat };${ query.destinolon },${ query.destinolat }`);
    url+=`.json?geometries=geojson&steps=true&overview=full&language=es&access_token=${ environment.mapbox.accessTokens }`;
    return this.http.get( url )
    .pipe(map((res: sear_ruta) => {
      return res;
    }));
  }

  calcularDistancia( params:any ) {

    let latitud1:any = params.latitud1;
    let longitud1:any = params.longitud1;
    let latitud2:any = params.latitud2;
    let longitud2:any = params.longitud2;
    let unidad_metrica:any = String();

    let distancia:any = Number();
    let radius:any = Number();
    radius = 6378.137;

    let deg2radMultiplier = Number();
    deg2radMultiplier = Math.PI / 180;

    latitud1 = latitud1 * deg2radMultiplier;
    longitud1 = longitud1 * deg2radMultiplier;

    latitud2 = latitud2 * deg2radMultiplier;
    longitud2 = longitud2 * deg2radMultiplier;

    let dlongitud = Number();
    dlongitud = longitud2 - longitud1;

        distancia = Math.acos(Math.sin(latitud1) * Math.sin(latitud2) + Math.cos(latitud1) *
        Math.cos(latitud2) * Math.cos(dlongitud)) * radius;

    if (unidad_metrica) unidad_metrica = 'M';
    distancia = distancia * 1000;

    return distancia;

  }
}