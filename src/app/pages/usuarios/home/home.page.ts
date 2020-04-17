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
import * as moment from 'moment';
import { ServicioActivoAction, OrdenActivoAction } from 'src/app/redux/app.actions';
import { MapboxService, Feature } from 'src/app/service-component/mapbox.service';
import { ModalController } from '@ionic/angular';
import { CalificacionPage } from 'src/app/dialog/calificacion/calificacion.page';

interface RespMarcadores {
  [ key:string ]: Lugar
};

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

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
  disabledOpt:string = '';
  disableBtn: boolean = false;
  disabled:boolean = false;
  disabledConfirm:boolean = false;
  disabledInfo:boolean = false;
  infoCliente:any = {};
  disableBtnInfo:boolean = false;
  
  addresses: any[] = [];
  selectedAddress = null;

  dataOrdenActiva:any = {};
  disableBtnOrdenCancelar:boolean = false;

  constructor(
    private http: HttpClient,
    private wsServices: WebsocketService,
    private geolocation: Geolocation,
    private _store: Store<PERSONA>,
    private _ordenes: OrdenesService,
    private _tools: ToolsService,
    private _Ofertando: OfertandoService,
    private mapboxService: MapboxService,
    private modalCtrl: ModalController,
  ) { 
    (Mapboxgl as any).accessToken = environment.mapbox.accessTokens;
    this._store
      .subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona || {};
        if(this.dataUser['rol']){
          this.rolUser = this.dataUser.rol.rol;
        }
        if( store.ordenactivo ) {
          if(Object.keys( store.ordenactivo ).length >0 ) { this.dataOrdenActiva = store.ordenactivo[0]; this.disabledOpt = 'ordenactiva'; }
          else this.dataOrdenActiva = false;
        }
        else this.dataOrdenActiva = false;
        console.log(this.dataOrdenActiva)
      });
  }

  ngOnInit(): void {
    this.InitApp();
  }
  
  InitApp(){
    this.id = this.wsServices.idSocket;
    this.getGeolocation();
    this.escucharSockets();
  }

  resetInit(){
    this.markersMapbox = {};
    this.lugares = {};
    this.InitApp();
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
        if( this.disabledOpt ==  "orden" ) return false;
        if(this.lat == geoposition.coords.latitude && this.lon == geoposition.coords.longitude ) return false;
        this.lat = geoposition.coords.latitude;
        this.lon = geoposition.coords.longitude;
        if(vandera){ this.initializeMap(); this.getSearchMyUbicacion(); if( this.rolUser == 'usuario' ) { this.llenandoData({ opt: 'conductor' }); } if( !this.markersMapbox[ this.id ] ) this.crearMarcador(); }
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

    //Ofertando

    this.wsServices.listen('ofreciendo-nuevo')
    .subscribe((marcador: any)=> {
      //console.log(marcador);
      if( this.dataUser.id !== marcador.orden.usuario ) return false;
      this.listOfertas.unshift( marcador );
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Ofreciendo servicio", text: `${ marcador['usuario'].nombre } Te LLevo $ ${ ( marcador['ofrece'] || 0 ).toLocaleString(1) } COP` });
    });

    // orden finalizada
    this.wsServices.listen('orden-finalizada')
    .subscribe((marcador: any)=> {
      // console.log(marcador);
      if( marcador.usuario.id !== this.dataUser.id ) return false;
      this._tools.presentToast("Servicio a Finalizado");
      this.llenandoData({ opt: 'conductor' });
      this.disabledConfirm = false;
      this.disabledOpt = 'cliente';
      this.data = {};
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Servicio Finalizado", text: `Gracias Por Usar Nuestro Servicio Te veremos pronto ${ marcador.usuario.nombre }` });
      let accion = new OrdenActivoAction( marcador, 'delete');
      this._store.dispatch( accion );
      this.openCalificacion( marcador );
    });
  }

  getSearchMyUbicacion(  ){
    this.mapboxService
      .search_wordLngLat(`${ this.lon },${ this.lat }`)
      .subscribe((features: Feature[]) => { });
  }

  getSearchDestinoMapbox( event: any ){
    const searchTerm = this.data.destino;
    if (searchTerm && searchTerm.length > 0) {
    this.mapboxService
      .search_word(searchTerm, this.lat, this.lon)
      .subscribe((features: Feature[]) => {
        this.addresses = features;
        // this.addresses = features.map(feat => feat.place_name);
      });
    } else {
      this.addresses = [];
    }

  }

  onSelect(address: any) {
    //console.log(address);
    this.data.destino = address.place_name;
    this.selectedAddress = address;
    this.addresses = [];
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
    this.mapa.addControl(new Mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));
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
      if( marcador.id  == this.id ) { this.lat = lngLat.lat; this.lon = lngLat.lng; }
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
    this.wsServices.emit( 'marcador-nuevo', customMarker);
  }

  exitOrden(){
    if(this.dataOrdenActiva) this.disabledOpt = "ordenactiva";
    this.disabled = false;
  }

  solicitar( opt:string ){
    this.data.tipo = opt;
    this.disabledOpt = "orden";
    this.disabledConfirm = false;
    this.disabled = true;
  }

  btnOrdenar(){
    this.disableBtn = true;
    let tipo = 0;
    if(this.data.tipo == 'Carga') tipo = 1;
    if(this.data.tipo == 'Domicilio') tipo = 2;
    let data:any = {
      usuario: this.dataUser.id,
      titulo: this.data.destino,
      origenLat: this.lat,
      tipoOrden: tipo,
      idClienteSockets: this.id,
      origenLon: this.lon,
      descripcion: this.data.descripcion,
      ofreceCliente: this.data.ofreces,
      destinolat: this.selectedAddress.center[1],
      destinoLon: this.selectedAddress.center[0]
    };
    if( !data.titulo ) return this._tools.presentToast("Error Destino no detallado");
    if( !data.ofreceCliente ) return this._tools.presentToast("Error Precio no establecido");
    this._ordenes.saved(data).subscribe((res:any)=>{
      // console.log(res);
      this._tools.presentToast('Solicitando servicio');
      this.wsServices.emit( 'orden-nuevo', res);
      this.data = {};
      this.disableBtn = false;
      this.disabled = false;
      this.disabledOpt = "";
      let accion = new OrdenActivoAction( res, 'post');
      this._store.dispatch(accion);
    },(error)=>{ console.error(error); this._tools.presentToast('Error al crear la orden'); this.disableBtn = false; });
  }

  btnCliente( item:any ){
    this.data = {
      destino: item.orden.titulo,
      id: item.id,
      orden: item.orden.id,
      ofreces: item.ofrece,
      descripcion: item.descripcion,
      idConductorSockets: item.idConductorSockets,
      coductorId: item.usuario.id
    };
    this.disabledOpt = 'cliente';
    this.disabledConfirm = true;
    this.disabled = true;
  }

  btnConfirn( ){
    this.disableBtn = true;
    this._ordenes.editar({
      id: this.data.orden,
      idOfertando: this.data.id,
      coductor: this.data.coductorId,
      ofreceConductor: this.data.ofreces,
      // destinolat: this.lat,
      // destinoLon: this.lon,
      estado: 3
    }).subscribe((res:any)=>{
      //console.log(res);
      res.idClienteSockets= this.id;
      this.wsServices.emit( 'orden-confirmada', res);
      this.listOfertas = [];
      this._tools.presentToast("Confirmada la Orden");
      this.disableBtn = false;
      this.disabled = false;
      this.removePactado( this.data );
      this.data = {};
      let accion = new OrdenActivoAction( res, 'put');
      this._store.dispatch(accion);
    },(error)=>{ console.error(error); this._tools.presentToast("Error al Confirmar Orden"); this.disableBtn=false; });
  }

  removePactado(marcador){
    for( let [id, item] of Object.entries(this.markersMapbox) ){
      //(console.log(id, item, marcador);
      if(id === this.id || id === ( marcador.idClienteSockets || marcador.idConductorSockets )){}
      else this.markersMapbox[id].remove();
    }
  }

  CancelarServicio(){
    let data:any = {
      id: this.dataOrdenActiva.id,
      estado: 1
    };
    this.disableBtnOrdenCancelar = true;
    this._ordenes.editar(data).subscribe((res:any)=>{
      //console.log(res);
      let accion = new OrdenActivoAction( res, 'delete');
      this._store.dispatch( accion );
      this.dataOrdenActiva = {};
      this._tools.presentToast("Cancelado Servicio");
      this.disableBtnOrdenCancelar = false;
      this.disabled = false;
      this.disabledOpt = "orden";
      this.wsServices.emit( 'orden-cancelada', res);
    }, ( error:any)=> { this._tools.presentToast("Error al cancelar el servicio"); this.disableBtnOrdenCancelar = false; });
  }

  ocultarMenu(){
    if( this.dataOrdenActiva ) this.disabledOpt = "ordenactiva";
    this.disabled = false;
    this.disabledOpt = "";
  }

  openCalificacion( item:any ){
    this.modalCtrl.create({
      component: CalificacionPage,
      componentProps: {
        obj: item
      }
    }).then(modal=>modal.present());
  }

}
