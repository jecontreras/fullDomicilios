import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Lugar } from 'src/app/interfas/interfaces';
import { WebsocketService } from 'src/app/services/websocket.services';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Store } from '@ngrx/store';
import { PERSONA } from 'src/app/interfas/sotarage';
import { OrdenesService } from 'src/app/service-component/ordenes.service';
import { ToolsService } from 'src/app/services/tools.service';
import { OfertandoService } from 'src/app/service-component/ofertando.service';
import { PaqueteService } from 'src/app/service-component/paquete.service';
import * as moment from 'moment';
import { ServicioActivoAction } from 'src/app/redux/app.actions';
import { NavParams, ModalController } from '@ionic/angular';
import { MapboxService, sear_ruta } from 'src/app/service-component/mapbox.service';
import { PaquetesPage } from 'src/app/dialog/paquetes/paquetes.page';
import { config } from 'rxjs';

interface RespMarcadores {
  [ key:string ]: Lugar
};

const URLACTIVACION =  environment.urlActivacion;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  
  mapa: Mapboxgl.Map;
  // lugares: Lugar[] = [];
  lugares: RespMarcadores = {};
  markersMapbox: { [id:string]: Mapboxgl.Marker } = {};
  lat:number;
  lon:number;
  total:string;
  id:any;
  seconds:number = 0;
  listOfertas:any = [];
  data:any = {};
  dataUser:any = {};
  rolUser:string;
  disabledOpt:string = 'orden';
  disableBtn: boolean = false;
  disabled:boolean = false;
  disabledConfirm:boolean = false;
  disabledInfo:boolean = false;
  infoCliente:any = {};
  disableBtnInfo:boolean = false;
  paramsData:any = {};
  ordenActiva:any = {};
  canvas:any;

  constructor(
    private http: HttpClient,
    private wsServices: WebsocketService,
    private geolocation: Geolocation,
    private _store: Store<PERSONA>,
    private _ordenes: OrdenesService,
    private _tools: ToolsService,
    private _Ofertando: OfertandoService,
    private navparams: NavParams,
    private modalCtrl: ModalController,
    private _mapbox: MapboxService,
    private _paquete: PaqueteService,
  ) { 
    (Mapboxgl as any).accessToken = environment.mapbox.accessTokens;
    this._store
      .subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona || {};
        if(this.dataUser['rol']){
          this.rolUser = this.dataUser.rol.rol;
        }
        this.ordenActiva = store.servicioActivo || {};
      });
      if(Object.keys(this.ordenActiva).length >0) this.procesoOrdenConfirmada(this.ordenActiva[0]);
  }

  ngOnInit(): void {
    this.InitApp();
  }
  
  InitApp(){
    this.id = this.wsServices.idSocket;
    this.paramsData = this.navparams.get('obj');
    console.log(this.paramsData);
    this.getGeolocation();
    this.escucharSockets();
    if(this.rolUser === 'conductor'){
      //this.getOrdenesActivas();
    }
  }

  exit(){
    this.modalCtrl.dismiss();
  }

  resetInit(){
    this.markersMapbox = {};
    this.lugares = {};
    this.InitApp();
  }

  getLatLongCliente(){
    let data:any = {
      origenlat: this.paramsData.origenLat,
      origenlon: this.paramsData.origenLon,
      destinolon: this.paramsData.destinoLon,
      destinolat: this.paramsData.destinolat
    }
    this._mapbox.search_ruta( data ).subscribe((res:any)=>{
      const interval = setInterval(row=>{
        if(this.mapa){
          let config:any = {
            startLon: this.paramsData.origenLon,
            startLat: this.paramsData.origenLat,
            startId: "point",
            startColor: '#3887be',
            destinoLon: this.paramsData.destinoLon,
            destinoLat: this.paramsData.destinolat,
            destinoColor: '#f30',
            idRoute: 'route',
            rutaColor: '#3887be'
          }
          this.armaRuta(res, config);
          clearInterval(interval);
        };
      }, 1000);
    });
  }

  getLatLongConductor(){
    let data:any = {
      origenlat: this.lat,
      origenlon: this.lon,
      destinolon: this.paramsData.origenLon,
      destinolat: this.paramsData.origenLat
    }
    this._mapbox.search_ruta( data ).subscribe((res:any)=>{
      const interval = setInterval(row=>{
        if(this.mapa){
          let config:any = {
            startLon: this.paramsData.origenLon,
            startLat: this.paramsData.origenLat,
            startId: "point2",
            startColor: '#3887be',
            destinoLon: this.paramsData.destinoLon,
            destinoLat: this.paramsData.destinolat,
            destinoColor: '#3773fb',
            idRoute: 'route2',
            rutaColor: '#28ba62'
          };
          this.armaRuta(res, config);
          clearInterval(interval);
          this.getLatLongCliente();
        }
      }, 1000);
    });
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

  llenandoData(params:any){
    this.http.post<RespMarcadores>(environment.urlServer+"/mapa",params)
    .subscribe( lugares=>{
      //console.log(lugares);
      this.lugares = lugares;
      if(this.lugares[this.id]) delete this.lugares[this.id];
      for( let [id, marcador] of Object.entries(this.lugares) ){
        if( !this.markersMapbox[id] ) this.agregarMarcador( marcador );
      }
    });
  }

  getGeolocation(){
    let vandera:boolean = true;
    setInterval(()=>{ 
      this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
        //console.log(geoposition)
        if(this.lat == geoposition.coords.latitude && this.lon == geoposition.coords.longitude ) return false;
        this.lat = geoposition.coords.latitude;
        this.lon = geoposition.coords.longitude;
        if(vandera){ 
          this.initializeMap(); 
          if( Object.keys(this.paramsData).length > 0 ) this.getLatLongConductor();
          if( this.rolUser == 'usuario' ) { 
            this.llenandoData({ opt: 'conductor' }); 
          } if( !this.markersMapbox[ this.id ] ) { 
            this.crearMarcador(); 
            // buscando id del sockeets para agregarlo al mapa
            if(this.paramsData) { this.addDialogMapa(); }
          }
        }
        vandera = false;
        const nuevoMarker = {
          id: this.id,
          lng: this.lon,
          lat: this.lat
        };
        this.wsServices.emit( 'marcador-mover', nuevoMarker);
        if(this.markersMapbox[ this.id ]){
          this.markersMapbox[ this.id ]
          .setLngLat([ this.lon, this.lat ]);
        }
        this.seconds = 3000;
      });
     }, this.seconds);
  }

  escucharSockets(){
    // marcador-nuevo
    this.wsServices.listen('marcador-nuevo')
    .subscribe((marcador: Lugar)=> {
      // console.log(marcador)
      if( this.rolUser === 'conductor' || marcador.rol === "usuario" ) return false;
      if( !this.mapa ) return false;
      if( !this.markersMapbox[ marcador.id ] )console.log(this.mapa); this.agregarMarcador( marcador )
    });

    // marcador-mover

    this.wsServices.listen('marcador-mover')
    .subscribe((marcador: Lugar)=> {
      if(!this.mapa) return false;
      if(!this.markersMapbox[ marcador.id ]) return false;
      this.markersMapbox[ marcador.id ]
      .setLngLat([ marcador.lng, marcador.lat ]);
    });

    // marcador-borrar

    this.wsServices.listen('marcador-borrar')
    .subscribe((id: string)=> {
      if(!this.mapa) return false;
      if(!this.markersMapbox[id]) return false;
      this.markersMapbox[id].remove();
      delete this.markersMapbox[id];
    });

    // orden-nueva

    this.wsServices.listen('orden-nuevo')
    .subscribe((marcador: any)=> {
      //console.log(marcador);
      if( this.rolUser === 'usuario' ) return false;
      this.listOfertas.unshift(marcador);
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Solicitud servicio", text: `${ marcador['usuario'].nombre } Destino ${ marcador['titulo']} Ofrece $ ${ ( marcador['ofreceCliente'] || 0 ).toLocaleString(1) } COP` });
    });

    //orden confirmada

    this.wsServices.listen('orden-confirmada')
    .subscribe((marcador: any)=> {
      //console.log(marcador);
      if( this.rolUser === 'usuario' ) return false;
      this.pushStoreServicio(marcador);
      this.procesoOrdenConfirmada(marcador);
    });

  }
  
  addDialogMapa(){
    this.llenandoData({ id: this.paramsData.idClienteSockets });
    if( Object.keys(this.ordenActiva).length == 0 ) this.btnConductor( this.paramsData );
  }

  procesoOrdenConfirmada(marcador:any){
    //console.log(marcador);
    if( marcador.coductor.id !== this.dataUser.id ) return this._tools.presentToast("Cliente no acepto");
    this._tools.presentToast("Cliente acepto");
    if( !marcador.origenConductorlat ) this.actualizarOrdenAceptada( marcador );
    this.listOfertas = this.listOfertas.filter((row:any)=> row.id != marcador.id);
    this.disabledInfo = true;
    this.infoCliente = marcador;
    this.removePactado(marcador);
    this.llenandoData({ id: marcador.idClienteSockets });
    this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Cliente acepto el servicio", text: `Destino ${ marcador.titulo } Costo $ ${ ( marcador['idOfertando'] || 0 ).toLocaleString(1) } COP` });
    this.paramsData = marcador;
    this.getLatLongCliente();
  }

  actualizarOrdenAceptada( marcador:any ){
    this._ordenes.editar({
      id: marcador.id,
      origenConductorlat: this.lat,
      origenConductorlon: this.lon
    }).subscribe((res:any)=> {
      //console.log("****", res);
      let accion = new ServicioActivoAction(res, 'put');
      this._store.dispatch(accion);
    });
  }

  pushStoreServicio(info:any){
    let accion = new ServicioActivoAction( info, 'post');
    this._store.dispatch(accion);
  }

  getOrdenesActivas(){
    this._ordenes.get({ 
      where:{ 
        estado: 0, 
        createdAt: {
          ">=": moment().add(-1, 'days'),
          "<=": moment().add(1, 'days')
        }
      },
      sort: 'createdAt DESC'
    }).subscribe((res:any)=>{
      this.listOfertas = res.data;
      const interval = setInterval(()=>{ 
        if(!this.listOfertas[this.listOfertas.length-1]) { clearInterval(interval); return false };
        this.listOfertas.splice(this.listOfertas.length-1, 1);
      }, 5000);
    });
  }

  audioNotificando(obj:any, mensaje:any){
    let sonido = new Audio();
    sonido.src = obj;
    sonido.load();
    sonido.play();
    this._tools.presentNotificacion(mensaje);
  }

  private initializeMap(){
    
    this.mapa = new Mapboxgl.Map({
      container: 'mapa',
      style: "mapbox://styles/mapbox/streets-v11",
      //center: [-75.75512993582937, 45.349977429009954],
      center: [ this.lon, this.lat],
      zoom: 16.6
    });
    this.canvas = this.mapa.getCanvasContainer();
    this.mapa.addControl(new Mapboxgl.NavigationControl());
  }

  agregarMarcador( marcador: Lugar) {
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

    const customPopup = new Mapboxgl.Popup( {
      offset: 25,
      closeOnClick: false
    }).setDOMContent( div );

    const marker = new Mapboxgl.Marker({
      draggable: true,
      color: marcador.color
    })
    .setLngLat([marcador.lng, marcador.lat])
    .setPopup( customPopup )
    .addTo( this.mapa );

    marker.on('drag', ()=>{
      const lngLat = marker.getLngLat();
      //console.log( lngLat );
      const nuevoMarker = {
        id: marcador.id,
        ...lngLat
      };
      this.wsServices.emit( 'marcador-mover', nuevoMarker);
    });

    // btnBorrar.addEventListener( 'click', ()=>{
    //   marker.remove();
    // });

    // btnBorrar.addEventListener( 'click', ()=>{
    //   marker.remove();
    //   this.wsServices.emit( 'marcador-borrar', marcador.id);
    // });

    this.markersMapbox[ marcador.id ] = marker;

  }

  crearMarcador(){
    //this.id = new Date().toISOString();
    if(!this.id) return false;
    const customMarker: Lugar = {
      id: this.id,
      userID: this.dataUser.id,
      rol: this.dataUser.rol.rol,
      estado: true,
      lng: this.lon,//-75.75512993582937,
      lat: this.lat,//45.349977429009954,
      nombre: `${ this.rolUser } ${ this.dataUser.nombre }`,
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    this.agregarMarcador( customMarker );

    //emitiendo evento marcador nuevo
    //this.wsServices.emit( 'marcador-nuevo', customMarker);
  }

  btnConductor( item:any ){
    this.data = {
      id: item.id,
      destino: item.titulo,
      ofreces: item.ofreceCliente,
      descripcion: item.descripcion,
    };
    this.disabledOpt = 'conductor';
    this.disabled = true;
  }

  async submitOfreciendo(){
    this.disableBtn = true;
    let querys:any = {
      usuario: this.dataUser.id,
      orden: this.data.id,
      ofrece: this.data.ofreces,
      descripcion: this.data.descripcion
    };
    //if( !this.dataUser.estadoCuenta ) { this.activarCuenta(); this.disableBtn = false; return this._tools.presentToast("Por favor primero debes activar tu cuenta"); }
    if( !querys.ofrece ) { this.disableBtn = false; return this._tools.presentToast("Error Precio no establecido"); }
    let permiso:any = await this.getUserPaquete();
    if( !permiso ) { this.openPaquete(); this.disableBtn = false; return this._tools.presentToast("Error no tienes Paquete Activo Por Favor Recargar"); }
    this._Ofertando.saved(querys).subscribe((res:any)=>{
      //console.log(res);
      this.listOfertas = this.listOfertas.filter( (row:any)=> row.id !== this.data.id );
      //console.log(this.listOfertas, this.data)
      this.disableBtn = false;
      this.disabled = false;
      res.idConductorSockets = this.id;
      this.wsServices.emit( 'ofreciendo-nuevo', res);
      this.data = {};
    },(error)=> { console.error(error); this._tools.presentToast("Error al Ofertar"); this.disableBtn = false; });
  }

  async getUserPaquete(){
    return new Promise( async(resolve) =>{
      this._paquete.getUser( { where: { usuario: this.dataUser.id, estado: 0 } }).subscribe(( res:any )=>{
        console.log(res);
        res = res.data[0];
        if( res ) resolve( true );
        else resolve( false );
      }, (error)=> resolve( false ));
    });
  }


  activarCuenta(){
    window.open( URLACTIVACION );
  }

  openPaquete(){
    this.modalCtrl.create({
      component: PaquetesPage,
      componentProps: {}
    }).then(modal=>modal.present());
    this.exit();
  }

  removePactado(marcador){
    for( let [id, item] of Object.entries(this.markersMapbox) ){
      //(console.log(id, item, marcador);
      if(id === this.id || id === ( marcador.idClienteSockets || marcador.idConductorSockets )){}
      else this.markersMapbox[id].remove();
    }
  }

  finalizarServicio(){
    this.disableBtnInfo = true;
    let data:any= {
      id: this.infoCliente.id,
      estado: 2
    };
    this._ordenes.editar(data).subscribe((res:any)=>{
      //console.log(res);
      this.infoCliente = {};
      this.disabledInfo = false;
      this.disableBtnInfo = false;
      this._tools.presentToast("Servicio a Finalizado");
      this.wsServices.emit( 'orden-finalizada', res);
      
      for( let [id, item] of Object.entries(this.markersMapbox) ){
        if( id === this.id ){}
        else this.markersMapbox[id].remove();
      }

      let accion = new ServicioActivoAction(res, 'delete');
      this._store.dispatch(accion);
      this.exit();
    },(error)=> {this._tools.presentToast("Error al actualizar servicio"); this.disabledInfo = false; } );
  }

}

