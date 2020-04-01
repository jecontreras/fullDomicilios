import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

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

  constructor(private http: HttpClient) { }

  search_word(query: string) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    // return this.http.get(url + query + '.json?types=region&access_token='
    return this.http.get(url + query + '.json?proximity=-74.2478958,4.6486259&access_token='
    + environment.mapbox.accessTokens)
    .pipe(map((res: MapboxOutput) => {
      return res.features;
    }));
  }
  search_ruta(query:any){
    let url = `https://api.mapbox.com/directions/v5/mapbox/driving/`+encodeURIComponent(`${ query.origenLon },${ query.origenLat };${ query.destinoLon },${ query.destinolat }`);
    url+=`.json?geometries=geojson&steps=true&overview=full&language=es&access_token=${ environment.mapbox.accessTokens }`;
    return this.http.get( url )
    .pipe(map((res: sear_ruta) => {
      return res;
    }));
  }
}