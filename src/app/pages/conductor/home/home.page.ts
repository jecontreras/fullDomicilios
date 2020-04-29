import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { PERSONA } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { OrdenesService } from 'src/app/service-component/ordenes.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { WebsocketService } from 'src/app/services/websocket.services';
import { Lugar } from 'src/app/interfas/interfaces';
import { ModalController, IonSegment } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { PersonaAction, ServicioActivoAction } from 'src/app/redux/app.actions';
import { MapboxService, Feature } from 'src/app/service-component/mapbox.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SolicitarPage } from 'src/app/dialog/solicitar/solicitar.page';
import { ChatService } from 'src/app/service-component/chat.service';
import { ChatDetalladoPage } from 'src/app/dialog/chat-detallado/chat-detallado.page';


const URLACTIVACION =  environment.urlActivacion;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  listRow:any = [];
  query:any = {
    where:{
      estado: [0, 3]
    },
    sort: 'createdAt DESC',
    skip: 0
  };

  query2:any = {
    where:{
      estado: 0,
      estadoOrden: [ 0, 3]
    },
    sort: 'createdAt DESC',
    skip: 0
  };
  
  @ViewChild(IonSegment, {static: false}) segment: IonSegment;

  public ev:any = {};
  public disable_list:boolean = true;
  public evScroll:any = {};
  public dataUser:any = {};
  public rolUser:string;

  id:any;
  seconds:number = 3000;
  lat:number;
  lon:number;
  ordenActiva:any = {};
  titulo:string = "Ocupado";
  estado:boolean = true;
  interval:any;

  view:string = "home";
  disableEstado:boolean = false;

  listRow2:any = [];

  constructor(
    private _tools: ToolsService,
    private _store: Store<PERSONA>,
    private _orden: OrdenesService,
    private geolocation: Geolocation,
    private wsServices: WebsocketService,
    private modalCtrl: ModalController,
    private _user: UserService,
    private mapboxService: MapboxService,
    private _mensajes: ChatService,
    private router: Router
  ) { 
    this._store.subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
        console.log(store);
        if( !store.servicioActivo ) store.servicioActivo = [];
        if( Object.keys( store.servicioActivo ).length > 0 ) this.ordenActiva = store.servicioActivo[0] || {};
        this.validanQueryUser();
    });
  }

  validanQueryUser(){
    if(this.dataUser.rol) this.rolUser = this.dataUser.rol.rol;
    this.query2.where.or = [
      { emisor: this.dataUser.id },
      { reseptor: this.dataUser.id }
    ]
    //this.query = { where:{ estado: 0 }, skip: 0 };
  }

  ngOnInit(): void {
    this.InitApp();
    var intervalID = window.setTimeout(()=>{
      this.segment.value = "home";
    }, 200);
  }

  InitApp(){
    this.id = this.wsServices.idSocket;
    this.InitProceso();
    if(!this.id ) this.contador();
  }

  contador(){
    this.interval = setInterval(()=>{
      this.InitProceso();
    },5000);
  }

  InitProceso( ){
    this.id = this.wsServices.idSocket;
    if(!this.id) {this._tools.presentToast("No hay Conexion"); return false;}
    if( this.dataUser.estadoCuenta ) { this.getList();}
    this.getGeolocation();
    this.escucharSockets();
    //this.getMisOrdenesActivar()
    clearInterval(this.interval);
  }

  getSearchMyUbicacion(){
    this.mapboxService
      .search_wordLngLat(`${ this.lon },${ this.lat }`)
      .subscribe((features: Feature[]) => { });
  }

  getGeolocation(){
    let vandera:boolean = true;
    setInterval(()=>{ 
      this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
        //console.log(geoposition)
        if(this.lat == geoposition.coords.latitude && this.lon == geoposition.coords.longitude ) return false;
        this.lat = geoposition.coords.latitude;
        this.lon = geoposition.coords.longitude;
        if(vandera){ this.crearMarcador(); this.getSearchMyUbicacion(); }
        vandera = false;
        this.seconds = 5000;
      });
     }, this.seconds);
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
    //emitiendo evento marcador nuevo
    this.wsServices.emit( 'marcador-nuevo', customMarker);
  }

  escucharSockets(){
    // orden-nueva

    this.wsServices.listen('orden-nuevo')
    .subscribe((marcador: any)=> {
      console.log(marcador);
      if( this.rolUser === 'usuario' ) return false;
      // Validando estado si esta disponible 
      if( !this.dataUser.estadoCuenta ) return false;
      // if( !( this.RangoOrden( marcador) ) ) return false;
      this.listRow.unshift(marcador);
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Solicitud servicio", text: `${ marcador['usuario'].nombre } Destino ${ marcador['titulo']} Ofrece $ ${ ( marcador['ofreceCliente'] || 0 ).toLocaleString(1) } COP` });
    });
    
    this.wsServices.listen('orden-confirmada')
    .subscribe((marcador: any)=> {
      //console.log(this.listRow, marcador);
      this.procesoOrdenConfirmada( marcador );
    });
    
    this.wsServices.listen('orden-finalizada')
    .subscribe((marcador: any)=> {
      //console.log(marcador);
      this.listRow = this.listRow.filter( (row:any) => row.id !== marcador.id );
    });
    //Orden cancelada

    this.wsServices.listen('orden-cancelada')
    .subscribe((marcador: any)=> {
      //console.log( marcador , this.listRow );
      if( !marcador.id ) return false;
      this.listRow = this.listRow.filter( ( row:any )=> row.id !== marcador.id );
    });

  }

  procesoOrdenConfirmada( marcador:any ){
    if(marcador.coductor.id == this.dataUser.id){
      let item = this.listRow.find( (row:any)=> row.id == marcador.id );
      item.check = true;
    }else{
      if(marcador.id) this.listRow = this.listRow.filter( (row:any) => row.id !== marcador.id );
    }
  }

  async RangoOrden( orden:any ){
    // return true;
    let data:any = {
      latitud1: this.lat,
      longitud1: this.lon,
      latitud2:  orden.origenLat,
      longitud2: orden.origenLon
    };
    let result = await this.mapboxService.calcularDistancia( data );
    console.log( result );
    if( result <= 10000 ) return true;
    return false;
  }

  audioNotificando(obj:any, mensaje:any){
    let sonido = new Audio();
    sonido.src = obj;
    sonido.load();
    sonido.play();
    this._tools.presentNotificacion(mensaje);
  }

  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    if( this.view == 'home' ) {
      this.listRow = [];
      this.getList();
    }
    if( this.view == 'chat' ){
      this.listRow2 = [];
      this.getList2();
    }
  }

  loadData(ev){
    //console.log(ev);
    this.evScroll = ev;
    if( this.view == 'home' ){
      this.query.skip++;
      this.getList();
    }
    if( this.view == 'chat' ){
      this.query2.skip++;
      this.getList2();
    }
  }

  getMisOrdenesActivar(){
    this._orden.get({ where:{ coductor: this.dataUser.id, estado: 3} }).subscribe((res:any)=>{
      res = res.data[0];
      if(!res) return false;
      let accion = new ServicioActivoAction( res, 'post');
      this._store.dispatch( accion );
      this.openMapa( res );
    },(error)=>this._tools.presentToast("Error de Conexion por favor refrescar"));
  }

  getList(){
    this._tools.presentLoading();
    // this.query.where.createdAt = {
    //   ">=": moment().add(-60, 'minutes'),
    //   "<=": moment().add(5, 'minutes')
    // }
    this._orden.get(this.query).subscribe((res:any)=>{
      this.dataFormaList(res);
      this._tools.dismisPresent();
    },(error)=> { this._tools.presentToast( "Error de conexion"); this._tools.dismisPresent(); });
  }

  dataFormaList(res:any){
    let formatiada = [];
    // for(let row of res.data){
    //   if( !( this.RangoOrden(row) ) ) continue;
    //   formatiada.push( row );
    // }
    this.listRow.push(...res.data );
    // console.log(this.listRow)
    this.listRow =_.unionBy(this.listRow || [], res.data, 'id');
    if( this.evScroll.target ){
      this.evScroll.target.complete()
    }
    if(this.ev){
      this.disable_list = true;
      if(this.ev.target){
        this.ev.target.complete();
      }
    }
    this._tools.dismisPresent();
  }

  getList2(){
    this.query.where.estadoOrden = 0;
    this._tools.presentLoading();
    this._mensajes.get(this.query2).subscribe((res:any)=>{
      // console.log(res);
      this.dataFormaList2(res);
      this._tools.dismisPresent();
    },(error)=> { this._tools.presentToast( "Error de conexion"); this._tools.dismisPresent(); });
  }

  dataFormaList2(res:any){
    this.listRow2.push(...res.data );
    this.listRow2 =_.unionBy(this.listRow2 || [], this.listRow2, 'id');
    if( this.evScroll.target ) this.evScroll.target.complete()
    if(this.ev){
      this.disable_list = true;
      if(this.ev.target){
        this.ev.target.complete();
      }
    }
  }

  openMapa( item:any ){
    item.vista = "detalles";
    console.log(item);
    this.modalCtrl.create({
      component: SolicitarPage,
      componentProps: {
        obj: item
      }
    }).then( async (modal)=>{
      modal.present();
      const { data } = await modal.onWillDismiss();
      this.listRow = [];
      this.query.skip = 0;
      this.validanQueryUser();
      this.getList();
    });
  }

  openChat( item:any ){
    if(!item) return false;
    item.vista = "drive";
    this.modalCtrl.create({
      component: ChatDetalladoPage,
      componentProps: {
        obj: item
      }
    }).then( async (modal)=>{
      modal.present();
    });
  }

  cambioVista( event:any ){
    this.view = event.detail.value;
    if( this.view == 'chat' ) this.getList2();
  }

  verMandados(){
    this.view = "mandados";
  }

  atras(){
    this.view = "home";
    this.segment.value = "home"
  }

  cerrar_seccion(){
    let accion = new PersonaAction({}, 'delete');
    this._store.dispatch(accion);
    localStorage.removeItem('user');
    localStorage.removeItem('APP');
    location.reload();
    this.router.navigate(['/portada']);
  }


  cambiarEstado(){
    let estado:any = !this.dataUser.estadoCuenta
    let data:any = {
      id: this.dataUser.id,
      estadoCuenta: estado
    };
    this.disableEstado = true;
    this._user.update(data).subscribe((res:any)=>{
      let accion = new PersonaAction( res, 'put');
      this._store.dispatch( accion );
      this.disableEstado = false;
    },(error)=> { console.error(error); this._tools.presentToast("Error de servidor"); this.disableEstado = false;})
  }
  
}
