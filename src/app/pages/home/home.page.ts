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
import { ServicioActivoAction } from 'src/app/redux/app.actions';

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
  disabledOpt:string = 'orden';
  disableBtn: boolean = false;
  disabled:boolean = false;
  disabledConfirm:boolean = false;
  disabledInfo:boolean = false;
  infoCliente:any = {};
  disableBtnInfo:boolean = false;

  constructor(
    private http: HttpClient,
    private wsServices: WebsocketService,
    private geolocation: Geolocation,
    private _store: Store<PERSONA>,
    private _ordenes: OrdenesService,
    private _tools: ToolsService,
    private _Ofertando: OfertandoService
  ) { 
    (Mapboxgl as any).accessToken = environment.mapbox.accessTokens;
    let ordenActiva:any= {};
    this._store
      .subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona || {};
        this.rolUser = this.dataUser.rol.rol;
        ordenActiva = store.servicioActivo || {};
      });
      if(Object.keys(ordenActiva).length >0) this.procesoOrdenConfirmada(ordenActiva[0]);
  }

  ngOnInit(): void {
    this.InitApp();
  }
  
  InitApp(){
    this.id = this.wsServices.idSocket;
    this.getGeolocation();
    this.escucharSockets();
    if(this.rolUser === 'conductor'){
      this.getOrdenesActivas();
      this.getOrdenesPactadasUser();
    }
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
        if(this.lat == geoposition.coords.latitude && this.lon == geoposition.coords.longitude ) return false;
        this.lat = geoposition.coords.latitude;
        this.lon = geoposition.coords.longitude;
        if(vandera){ this.initializeMap(); if( this.rolUser == 'usuario' ) { this.llenandoData({ opt: 'conductor' }); } if( !this.markersMapbox[ this.id ] ) this.crearMarcador(); }
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

    //Ofertando

    this.wsServices.listen('ofreciendo-nuevo')
    .subscribe((marcador: any)=> {
      //console.log(marcador);
      if( this.dataUser.id !== marcador.orden.usuario ) return false;
      this.listOfertas.unshift( marcador );
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Ofreciendo servicio", text: `${ marcador['usuario'].nombre } Te LLevo $ ${ ( marcador['ofrece'] || 0 ).toLocaleString(1) } COP` });
    });

    //orden confirmada

    this.wsServices.listen('orden-confirmada')
    .subscribe((marcador: any)=> {
      console.log(marcador);
      if( this.rolUser === 'usuario' ) return false;
      this.pushStoreServicio(marcador);
      this.procesoOrdenConfirmada(marcador);
    });

    // orden finalizada
    this.wsServices.listen('orden-finalizada')
    .subscribe((marcador: any)=> {
      //console.log(marcador);
      if( marcador.usuario.id !== this.dataUser.id ) return false;
      this._tools.presentToast("Servicio a Finalizado");
      this.llenandoData({ opt: 'conductor' });
      this.disabledConfirm = false;
      this.disabledOpt = 'cliente';
      this.data = {};
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Servicio Finalizado", text: `Gracias Por Usar Nuestro Servicio Te veremos pronto ${ marcador.usuario.nombre }` });
    });
  }
  procesoOrdenConfirmada(marcador:any){
    //console.log(marcador.coductor);
    if( marcador.coductor.id !== this.dataUser.id ) return this._tools.presentToast("Cliente no acepto");
    this._tools.presentToast("Cliente acepto");
    this.listOfertas = this.listOfertas.filter((row:any)=> row.id != marcador.id);
    this.disabledInfo = true;
    this.infoCliente = marcador;
    this.removePactado(marcador);
    this.llenandoData({ id: marcador.idClienteSockets });
    this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Cliente acepto el servicio", text: `Destino ${ marcador.titulo } Costo $ ${ ( marcador['idOfertando'] || 0 ).toLocaleString(1) } COP` });
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

  getOrdenesPactadasUser(){
   
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
    this.wsServices.emit( 'marcador-nuevo', customMarker);
  }

  solicitar(){
    this.disabled = !this.disabled;
  }

  btnOrdenar(){
    this.disableBtn = true;
    let data:any = {
      usuario: this.dataUser.id,
      titulo: this.data.destino,
      origenLat: this.lat,
      origenLon: this.lon,
      descripcion: this.data.descripcion,
      ofreceCliente: this.data.ofreces
    };
    if( !data.titulo ) return this._tools.presentToast("Error Destino no detallado");
    if( !data.ofreceCliente ) return this._tools.presentToast("Error Precio no establecido");
    this._ordenes.saved(data).subscribe((res:any)=>{
      console.log(res);
      this._tools.presentToast('Solicitando servicio');
      this.wsServices.emit( 'orden-nuevo', res);
      this.data = {};
      this.disableBtn = false;
      this.disabled = false;
    },(error)=>{ console.error(error); this._tools.presentToast('Error al crear la orden'); this.disableBtn = false; });
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

  submitOfreciendo(){
    this.disableBtn = true;
    let querys:any = {
      usuario: this.dataUser.id,
      orden: this.data.id,
      ofrece: this.data.ofreces,
      descripcion: this.data.descripcion
    };
    if( !querys.ofrece ) return this._tools.presentToast("Error Precio no establecido");
    this._Ofertando.saved(querys).subscribe((res:any)=>{
      //console.log(res);
      this.listOfertas = this.listOfertas.filter( (row:any)=> row.id !== this.data.id );
      console.log(this.listOfertas, this.data)
      this.disableBtn = false;
      this.disabled = false;
      res.idConductorSockets = this.id;
      this.wsServices.emit( 'ofreciendo-nuevo', res);
      this.data = {};
    },(error)=> { console.error(error); this._tools.presentToast("Error al Ofertar"); this.disableBtn = false; });
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
      destinolat: this.lat,
      destinoLon: this.lon,
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
    },(error)=>{ console.error(error); this._tools.presentToast("Error al Confirmar Orden"); this.disableBtn=false; });
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
    },(error)=> {this._tools.presentToast("Error al actualizar servicio"); this.disabledInfo = false; } );
  }

}
