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
import { MapaPage } from '../mapa/mapa.page';
import { UserService } from 'src/app/services/user.service';
import { PersonaAction, OrdenActivoAction, ServicioActivoAction } from 'src/app/redux/app.actions';
import { PerfilSettingsPage } from 'src/app/dialog/perfil-settings/perfil-settings.page';
import { ResenaService } from 'src/app/service-component/resena.service';
import { MapboxService, Feature } from 'src/app/service-component/mapbox.service';
import { PaquetesPage } from 'src/app/dialog/paquetes/paquetes.page';
import { PaqueteService } from 'src/app/service-component/paquete.service';
import { HistorialPagosPage } from 'src/app/dialog/historial-pagos/historial-pagos.page';
import { environment } from 'src/environments/environment';
import { CalificacionPage } from 'src/app/dialog/calificacion/calificacion.page';


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
      estado: 0,
      tipoOrden: 0
    },
    skip: 0
  };

  query3:any = {
    where:{
      estado: 0
    },
    sort: "createdAt DESC",
    skip: 0,
    limit: 10
  };

  listPage:any = ["SOLICITUDES","INGRESOS","CLASIFICACIÓN","PAGO"];
  disableView:string = "SOLICITUDES";
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
  
  listRow2:any = [];
  query2:any = {
    where:{
      estado: 2 
    },
    skip: 0
  };
  lisComentario:any = [];
  titulo:string = "Ocupado";
  estado:boolean = true;
  cargaBolena: boolean = false;
  dataPagos:number;
  disabledComentarios: boolean = false;
  interval:any;

  constructor(
    private _tools: ToolsService,
    private _store: Store<PERSONA>,
    private _orden: OrdenesService,
    private geolocation: Geolocation,
    private wsServices: WebsocketService,
    private modalCtrl: ModalController,
    private _user: UserService,
    private _resena: ResenaService,
    private mapboxService: MapboxService,
    private _paquete: PaqueteService
  ) { 
    this._store.subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
        if( !store.servicioActivo ) store.servicioActivo = [];
        if( Object.keys( store.servicioActivo ).length > 0 ) this.ordenActiva = store.servicioActivo[0] || {};
        this.validanQueryUser();
    });
  }

  validanQueryUser(){
    if(this.dataUser.rol) this.rolUser = this.dataUser.rol.rol;
    this.query = { where:{ estado: 0, tipoOrden: 0 }, skip: 0 };
    if( this.dataUser.carga ) this.query.where.tipoOrden = [ 0, 1 ];
    if( this.dataUser.domicilio ) this.query.where.tipoOrden = [ 0, 1, 2 ];
    this.dataUser.estadoDisponible == true ? this.estado = true : this.estado = false;
    this.dataUser.carga === true ? this.cargaBolena =  true : this.cargaBolena = false;
  }

  ngOnInit(): void {
    this.InitApp();
    var intervalID = window.setTimeout(()=>{
      this.segment.value = "SOLICITUDES";
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
    this.query3.where.usuario = this.dataUser.id;
    if( this.dataUser.estadoDisponible ) { this.getList();}
    this.getGeolocation();
    this.escucharSockets();
    this.getMisOrdenesActivar()
    clearInterval(this.interval);
  }

  getSearchMyUbicacion(){
    this.mapboxService
      .search_wordLngLat(`${ this.lon },${ this.lat }`)
      .subscribe((features: Feature[]) => { });
  }

  cambioView(ev:any){
    // console.log(ev);
    this.disableView = ev.detail.value;
    if( this.disableView == 'INGRESOS' ) this.getList2();
    if( this.disableView == 'CLASIFICACIÓN' ) { this.informacionResena(); this.getListComentario(); }
    if( this.disableView == 'PAGO') this.informacionCuenta();
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
      if( this.rolUser === 'usuario' ) return false;
      // Validando estado si esta disponible 
      if( !this.dataUser.estadoDisponible ) return false;
      //validar tipo de servicio si es normal o de carga
      if( marcador.tipoOrden == 1 ) if( !this.dataUser.carga ) return false;
      if( marcador.tipoOrden == 2 ) if( !this.dataUser.domicilio ) return false;
      if( !( this.RangoOrden( marcador) ) ) return false;
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
    // if( this.dataUser.departamento == orden.usuario.departamento ) return true;
    // else return false;
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
    if(this.disableView == 'SOLICITUDES'){
      this.listRow = [];
      this.getList();
      if(Object.keys(this.ordenActiva).length > 0) this.openMapa({});
    }
    if(this.disableView == 'INGRESOS'){
      this.listRow2 = [];
      this.getList2();
    }
  }

  loadData(ev){
    //console.log(ev);
    this.evScroll = ev;
    if(this.disableView == 'SOLICITUDES'){
      this.query.skip++;
      this.getList();
    }
    if(this.disableView == 'INGRESOS'){
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
    this.query.where.createdAt = {
      ">=": moment().add(-60, 'minutes'),
      "<=": moment().add(5, 'minutes')
    }
    this._orden.get(this.query).subscribe((res:any)=>{
      // console.log(res);
      this.dataFormaList(res);
      this._tools.dismisPresent();
    },(error)=> { this._tools.presentToast( "Error de conexion"); this._tools.dismisPresent(); });
  }

  dataFormaList(res:any){
    let formatiada = [];
    for(let row of res.data){
      if( !( this.RangoOrden(row) ) ) continue;
      formatiada.push( row );
    }
    this.listRow.push(...formatiada );
    // console.log(this.listRow)
    this.listRow =_.unionBy(this.listRow || [], formatiada, 'id');
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
    this.query2.where.createdAt = {
      ">=": moment().add(-1, 'days'),
      "<=": moment().add(1, 'days')
    }
    this._tools.presentLoading();
    this._orden.get(this.query2).subscribe((res:any)=>{
      // console.log(res);
      this.dataFormaList2(res);
      this._tools.dismisPresent();
    },(error)=> { this._tools.presentToast( "Error de conexion"); this._tools.dismisPresent(); });
  }

  dataFormaList2(res:any){
    this.listRow2.push(...res.data );
    // console.log(this.listRow2)
    this.listRow2 =_.unionBy(this.listRow2 || [], res.data, 'id');
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

  openMapa( item:any ){
    this.modalCtrl.create({
      component: MapaPage,
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

  async openSettingUser( ){
    this.modalCtrl.create({
      component: PerfilSettingsPage,
      componentProps: {
        obj: this.dataUser
      }
    }).then( async (modal)=>{
      modal.present()
      const { data } = await modal.onWillDismiss();
      this.getList();
    });
  }

  informacionResena(){
    let data:any = {
      user: this.dataUser.id
    };
    this._resena.getResena( data ).subscribe((res:any)=>{
      if( res.data == 0 ) return false;
      this.dataUser.nameResena = res.data.nameResena;
      this.dataUser.nameOperacion = res.data.nameOperacion;
      this.dataUser.nameResenaCount = res.data.nameResenaCount / 100;
      this.dataUser.nameOperacionCount = res.data.nameOperacionCount / 100;
      this.dataUser.nameResenaTotal = res.data.totalResena;
      this.dataUser.nameOperacionTotal = res.data.nameOperacionCount;
    }, () => this._tools.presentToast("Error de servidor") );
    this.informacionCuenta();
  }

  OpenPaquetes(){
    this.modalCtrl.create({
      component: PaquetesPage,
      componentProps: {}
    }).then(modal=>modal.present());
  }

  OpenHistorialPagos(){
    this.modalCtrl.create({
      component: HistorialPagosPage,
      componentProps: {}
    }).then(modal=>modal.present());
  }

  registrarCuenta(){
    window.open( URLACTIVACION );
  }

  informacionCuenta(){
    this._paquete.getUser( { where:{ usuario: this.dataUser.id, estado: 0 } } ).subscribe(( res:any )=>{
      res = res.data;
      this.dataPagos = ( _.sumBy( res, ( row:any ) => row.pago.x_amount ) ) - ( _.sumBy( res, ( row:any ) => row.acomuladoCostoServicio ) );
    });
  }

  getListComentario(){
    this._tools.presentLoading();
    this._resena.get( this.query3 ).subscribe((res:any)=>{
      this.dataFormaListComentario(res);
      this._tools.dismisPresent();
    },(error)=> this._tools.dismisPresent());
  }

  dataFormaListComentario(res:any){
    this.lisComentario.push(...res.data );
    this.lisComentario =_.unionBy(this.lisComentario || [], res.data, 'id');
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

  openComentarios(){
    this.disabledComentarios = true;
    this._orden.get({ where: { coductor: this.dataUser.id }, limit: 1  }).subscribe((res:any)=>{
      if(!res.data[0]) return this._tools.presentToast( "Lo sentimos no tienes Comentarios!");
      this.disabledComentarios = false;
      this.modalCtrl.create({
        component: CalificacionPage,
        componentProps: {
          obj: res.data[0]
        }
      }).then(modal=>modal.present());
    });
  }
  
}
