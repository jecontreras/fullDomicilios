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
import { ModalController } from '@ionic/angular';

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

  constructor(
    private http: HttpClient,
    private wsServices: WebsocketService,
    private geolocation: Geolocation,
    private _store: Store<PERSONA>,
    private _tools: ToolsService,
    private mapboxService: MapboxService,
    private modalCtrl: ModalController,
  ) {
    (Mapboxgl as any).accessToken = environment.mapbox.accessTokens;
    this._store.subscribe((store: any) => {
        store = store.name;
        this.dataUser = store.persona || {};
        if (this.dataUser['rol']) this.rolUser = this.dataUser.rol.rol;
      });
  }

  ngOnInit(): void {
    this.InitApp();
  }

  ionViewDidLeave() {
    console.log(4)
    this.banderaRefres = true;
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
    this.getGeolocation();
    this.escucharSockets();
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
        //console.log(lugares);
        this.lugares = lugares;
        if (this.lugares[this.id]) delete this.lugares[this.id];
        for (let [id, marcador] of Object.entries(this.lugares)) {
          if (!this.markersMapbox[id]) this.agregarMarcador(marcador);
        }
      });
  }

  getGeolocation() {
    let vandera: boolean = true;
    setInterval(() => {
      this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
        //console.log(geoposition)
        if (this.disabledOpt == "orden") return false;
        if (this.lat == geoposition.coords.latitude && this.lon == geoposition.coords.longitude) return false;
        this.lat = geoposition.coords.latitude;
        this.lon = geoposition.coords.longitude;
        if (vandera) { this.initializeMap(); this.getSearchMyUbicacion();  if (!this.markersMapbox[this.id]) this.crearMarcador(); }
        vandera = false;
        this.seconds = 3000;
      });
    }, this.seconds);
  }

  escucharSockets() {
    // marcador-nuevo
    // this.wsServices.listen('marcador-nuevo')
    // .subscribe((marcador: Lugar)=> {
    //   // console.log(marcador)
    //   if( this.rolUser === 'conductor' || marcador.rol === "usuario" ) return false;
    //   if( !this.mapa ) return false;
    //   if( !this.markersMapbox[ marcador.id ] )console.log(this.mapa); this.agregarMarcador( marcador )
    // });
  }

  getSearchMyUbicacion() {
    this.mapboxService
      .search_wordLngLat(`${this.lon},${this.lat}`)
      .subscribe((features: Feature[]) => { });
  }

  private initializeMap() {

    this.mapa = new Mapboxgl.Map({
      container: 'mapa',
      style: "mapbox://styles/mapbox/streets-v11",
      //center: [-75.75512993582937, 45.349977429009954],
      center: [this.lon, this.lat],
      zoom: 16.6
    });
    const geolocate: any = new Mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    this.mapa.addControl(geolocate)
    setTimeout(function () {
      geolocate._geolocateButton.click();
    }, 5000);
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
    this.agregarMarcador(customMarker);

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

  exit(){
    this.modalCtrl.dismiss(
      { 'dismissed': false }
    );
  }

}

