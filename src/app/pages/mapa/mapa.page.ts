import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Lugar } from 'src/app/interfas/interfaces';
import { WebsocketService } from 'src/app/services/websocket.services';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Store } from '@ngrx/store';
import { PERSONA } from 'src/app/interfas/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { MapboxService, Feature } from 'src/app/service-component/mapbox.service';
import { ModalController, NavParams } from '@ionic/angular';

interface RespMarcadores {
  [key: string]: Lugar
};
declare const $: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  paramsData:any = {};
  mapa: Mapboxgl.Map;
  // lugares: Lugar[] = [];
  lugares: RespMarcadores = {};
  markersMapbox: { [id: string]: Mapboxgl.Marker } = {};
  lat: number;
  lon: number;
  id: any;
  seconds: number = 0;
  data: any = {};
  dataUser: any = {};
  rolUser: string;
  disabledOpt: string = '';
  disabled: boolean = false;

  banderaRefres: boolean = false;

  interval: any;
  marcadorLat:any;
  marcadorLon:any;
  vista:any;

  noActivar:boolean = true;

  constructor(
    private http: HttpClient,
    private wsServices: WebsocketService,
    private geolocation: Geolocation,
    private _store: Store<PERSONA>,
    private _tools: ToolsService,
    private mapboxService: MapboxService,
    private modalCtrl: ModalController,
    private navparams: NavParams,
    private _mapbox: MapboxService
  ) {
    (Mapboxgl as any).accessToken = environment.mapbox.accessTokens;
    this._store.subscribe((store: any) => {
        store = store.name;
        this.dataUser = store.persona || {};
        if (this.dataUser['rol']) this.rolUser = this.dataUser.rol.rol;
      });
  }

  ngOnInit(): void {
    this.paramsData = this.navparams.get('obj');
    this.vista = this.paramsData.vista;
    console.log(this.paramsData);
    this.InitApp();
    this._tools.presentLoading();
  }

  InitApp() {
    this.id = this.wsServices.idSocket;
    this.InitProceso();
    if (!this.id) this.contador();
  }

  contador() {
    this.interval = setInterval(() => {
      this.InitProceso();
    }, 5000);
  }

  InitProceso() {
    this.id = this.wsServices.idSocket;
    if (!this.id) { this._tools.presentToast("No hay Conexion"); return false; }
    this.escucharSockets();
    this.getGeolocation();
    let interval:any = setInterval(()=>{
      if(!this.mapa) return false;
      if(this.vista == "ver_drive") this.llenandoData( { id: this.paramsData.chatDe.idSockets } );
      if(this.vista == "origen_detalle") { this.noActivar = false; this.armarDataOrigenConductorDetalle(); }
      if(this.vista == "destino_detalle") { this.noActivar = false; this.armarDataDestinoOrdenDetalle(); }
      clearInterval( interval );
    },3000 )
    clearInterval(this.interval);
  }

  resetInit() {
    this.markersMapbox = {};
    this.lugares = {};
    this.InitApp();
  }

  llenandoData(params: any) {
    this.http.post<RespMarcadores>(environment.urlServer + "/mapa", params)
      .subscribe(lugares => {
        this.lugares = lugares;
        if (this.lugares[this.id]) delete this.lugares[this.id];
        for (let [id, marcador] of Object.entries(this.lugares)) {
          if (!this.markersMapbox[id]) this.agregarMarcador(marcador);
        }
        if(this.vista == "ver_drive") this.armarDataOrigenConductor(lugares);
      });
  }

  getGeolocation() {
    let vandera: boolean = true;
    setTimeout(()=>{
      this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
        if (this.lat == geoposition.coords.latitude && this.lon == geoposition.coords.longitude) return false;
        this.lat = geoposition.coords.latitude;
        this.lon = geoposition.coords.longitude;
        if (vandera) { this.initializeMap(); this.getSearchMyUbicacion();  if (!this.markersMapbox[this.id]) this.crearMarcador(); }
        vandera = false;
        this.seconds = 3000;
      });
    }, this.seconds);
    setTimeout(()=>{
      if (vandera) { this.initializeMap(); this.getSearchMyUbicacion();  if (!this.markersMapbox[this.id]) this.crearMarcador(); }  
    },2000)
  }

  escucharSockets() {
    // marcador-mover

    this.wsServices.listen('marcador-mover')
    .subscribe((marcador: Lugar)=> {
      if(!this.mapa) return false;
      if(!this.markersMapbox[ marcador.id ]) return false;
      this.markersMapbox[ marcador.id ]
      .setLngLat([ marcador.lng, marcador.lat ]);
    });
  }

  getSearchMyUbicacion() {
    this.mapboxService
      .search_wordLngLat(`${this.lon},${this.lat}`)
      .subscribe((features: Feature[]) => { });
  }

  private initializeMap() {
    if( !Mapboxgl.Map ) return false;
    if( !this.lon ) { this.lon = this.dataUser.longitud; this.lat = this.dataUser.latitud; }
    this.mapa = new Mapboxgl.Map({
      container: 'mapa',
      style: "mapbox://styles/mapbox/streets-v11",
      //center: [-75.75512993582937, 45.349977429009954],
      center: [this.lon, this.lat ],
      zoom: 16.6
    });
    const geolocate: any = new Mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    this.mapa.addControl(geolocate)
    setTimeout(()=>{
      geolocate._geolocateButton.click();
      this._tools.dismisPresent();
    }, 3000);
  }

  agregarMarcador(marcador: Lugar) {
    // const html = `<h2>${ marcador.nombre }</h2>
    //               <br>
    //               <button>Borrar</button>`;
    const h2 = document.createElement('h2');
    h2.innerText = marcador.nombre;

    //const btnBorrar = document.createElement('button');
    //btnBorrar.innerText = 'Borrar';

    const div = document.createElement('div');
    //div.append(h2, btnBorrar);
    div.append(h2);

    const customPopup = new Mapboxgl.Popup({
      offset: 25,
      closeOnClick: false
    }).setDOMContent(div);

      const marker = new Mapboxgl.Marker({
        draggable: true,
        color: marcador.color
      })
      .setLngLat([marcador.lng, marcador.lat])
      .setPopup(customPopup)
      .addTo(this.mapa);
     marker.on('drag', ()=>{
       const lngLat = marker.getLngLat();
       //console.log( lngLat );
       const nuevoMarker = {
         id: marcador.id,
         ...lngLat
       };
       this.marcadorLat = lngLat.lat;
       this.marcadorLon = lngLat.lng;
      //  if( marcador.id  == this.id ) { this.lat = lngLat.lat; this.lon = lngLat.lng; }
      //  this.wsServices.emit( 'marcador-mover', nuevoMarker);
     });

    // btnBorrar.addEventListener( 'click', ()=>{
    //   marker.remove();
    // });

    // btnBorrar.addEventListener( 'click', ()=>{
    //   marker.remove();
    //   this.wsServices.emit( 'marcador-borrar', marcador.id);
    // });

    this.markersMapbox[marcador.id] = marker;

  }

  crearMarcador() {
    //this.id = new Date().toISOString();
    const customMarker: Lugar = {
      id: this.id,
      userID: this.dataUser.id,
      rol: this.dataUser.rol.rol,
      estado: true,
      lng: this.lon,//-75.75512993582937,
      lat: this.lat,//45.349977429009954,
      nombre: `${this.rolUser} ${this.dataUser.nombre}`,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    };
    //this.agregarMarcador(customMarker);
    //emitiendo evento marcador nuevo
    this.wsServices.emit('marcador-nuevo', customMarker);
  }

  codigo() {
    return (Date.now().toString(20).substr(2, 3) + Math.random().toString(20).substr(2, 3)).toUpperCase();
  }

  submitDireccion(){
    this.modalCtrl.dismiss(
      {'dismissed': {
          lat: this.marcadorLat,
          lon: this.marcadorLon
        }
     }
    );
  }
  //esta funcion viene es de solicitar el opt origen_detalle
  armarDataOrigenConductorDetalle( ){
    let data:any = {
      origenlat: this.lat,
      origenlon: this.lon,
      destinolon: this.paramsData.origenLon,
      destinolat: this.paramsData.origenLat,
      startLon: this.lat,
      startLat: this.lon,
      destinoLon: this.paramsData.origenLon,
      destinoLat: this.paramsData.origenLat
    };
    this.getLatLongCliente( data );
  }
  //esta funcion viene es de solicitar el opt destino_detalle
  armarDataDestinoOrdenDetalle(){
    let data:any = {
      origenlat: this.paramsData.origenLat,
      origenlon: this.paramsData.origenLon,
      destinolon: this.paramsData.destinoLon,
      destinolat: this.paramsData.destinolat,
      startLon: this.paramsData.origenLon,
      startLat: this.paramsData.origenLat,
      destinoLon: this.paramsData.destinoLon,
      destinoLat: this.paramsData.destinolat
    };
    this.getLatLongConductor( data );
  }

  armarDataOrigenConductor( lugar:any ){
    console.log(lugar);
    let valores:any = Object.values(lugar);
    if(!valores[0]) { 
      this._tools.presentToast("El drive no esta conectado");
      valores = {
        lat: this.paramsData.ordenes.origenConductorlat,
        lng: this.paramsData.ordenes.origenConductorlon,
        nombre: this.paramsData.ordenes.coductor.nombre,
        color: "#3171e0",
        id: this.paramsData.ordenes.coductor.idSockets
      };
      this.agregarMarcador(valores)
    }else valores = valores[0];
    let data:any = {
      origenlat: valores.lat,
      origenlon: valores.lng,
      destinolon: this.paramsData.ordenes.origenLon,
      destinolat: this.paramsData.ordenes.origenLat,
      startLon: valores.lng,
      startLat: valores.lat,
      destinoLon: this.paramsData.ordenes.origenLon,
      destinoLat: this.paramsData.ordenes.origenLat
    };
    this.getLatLongCliente( data );
  }

  armarDataDestinoOrden(){
    let data:any = {
      origenlat: this.paramsData.ordenes.origenLat,
      origenlon: this.paramsData.ordenes.origenLon,
      destinolon: this.paramsData.ordenes.destinoLon,
      destinolat: this.paramsData.ordenes.destinolat,
      startLon: this.paramsData.ordenes.origenLon,
      startLat: this.paramsData.ordenes.origenLat,
      destinoLon: this.paramsData.ordenes.origenLon,
      destinoLat: this.paramsData.ordenes.origenLat
    };
    this.getLatLongConductor( data );
  }

  getLatLongCliente(data:any){
    this._mapbox.search_ruta( data ).subscribe((res:any)=>{
      const interval = setInterval(row=>{
        if(this.mapa){
          let config:any = {
            startLon: data.startLon,
            startLat: data.startLat,
            startId: "point",
            startColor: '#3887be',
            destinoLon: data.destinoLon,
            destinoLat: data.destinoLat,
            destinoColor: '#f30',
            idRoute: 'route',
            rutaColor: '#3887be'
          }
          this.armaRuta(res, config);
          clearInterval(interval);
          // this.armarDataDestinoOrden();
        };
      }, 1000);
    });
  }

  getLatLongConductor( data:any ){
    const interval = setTimeout(row=>{
      this._mapbox.search_ruta( data ).subscribe((res:any)=>{
        const interval = setTimeout(row=>{
          if(this.mapa){
            let config:any = {
              startLon: data.startLon,
              startLat: data.startLat,
              startId: "point2",
              startColor: '#3887be',
              destinoLon: data.destinoLon,
              destinoLat: data.destinoLat,
              destinoColor: '#3773fb',
              idRoute: 'route2',
              rutaColor: '#28ba62'
            };
            this.armaRuta(res, config);
            clearInterval(interval);
          }
        }, 1000);
      });
    }, 2000);
  }

  creandorRuta( res:any, config:any ){
    let data = res.routes[0];
    let route = data.geometry.coordinates;
    let geojson:any = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };
    if (this.mapa.getSource('route')) {
      this.mapa.getSource('route')['setData'](geojson);
    }else{
      this.mapa.addLayer({
        id: config.idRoute,
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': config.rutaColor,
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
  }

  armaRuta( res:any, config:any ){
    if(this.mapa) this.validandoMapa(res, config);
    else{
      this.mapa.on('load', ()=>{
        console.log("cargado mapa");
        this.validandoMapa(res, config);
      });
    }
  }

  validandoMapa(res, config:any){
    this.creandorRuta(res, config);
      // let start = [ this.lon, this.lat ];
      let start = [ config.startLon, config.startLat ];
      if (this.mapa.getLayer('point')) {
        //this.mapa.getSource('point')['setData'](start);
      }else{
        this.mapa.addLayer({
          id: config.startId,
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: start
                }
              }
              ]
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': config.startColor
          }
        });   
      }
      let coords = [ config.destinoLon, config.destinoLat ];
      var end = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: coords
          }
        }
        ]
      };
      if (this.mapa.getLayer('end')) {
        this.mapa.getSource('end')['setData'](end);
      } else {
        this.mapa.addLayer({
          id: 'end',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: coords
                }
              }]
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': config.destinoColor
          }
        });
      }
  }

  agregarMarkerBtn(){
    const customMarker: Lugar = {
      id: new Date().toISOString(),
      userID: this.dataUser.id,
      rol: this.dataUser.rol.rol,
      estado: true,
      lng: this.lon,//-75.75512993582937,
      lat: this.lat,//45.349977429009954,
      nombre: `${this.rolUser} ${this.dataUser.nombre}`,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    };
    this.marcadorLat = this.lat;
    this.marcadorLon = this.lon;
    this.agregarMarcador( customMarker );
  }

  exit(){
    this.modalCtrl.dismiss(
      { 'dismissed': true }
    );
  }

}

