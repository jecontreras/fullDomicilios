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
import { PersonaAction } from 'src/app/redux/app.actions';

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

  constructor(
    private _tools: ToolsService,
    private _store: Store<PERSONA>,
    private _orden: OrdenesService,
    private geolocation: Geolocation,
    private wsServices: WebsocketService,
    private modalCtrl: ModalController,
    private _user: UserService
  ) { 
    this._store.subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
        if(this.dataUser.rol) this.rolUser = this.dataUser.rol.rol;
        if(store.servicioActivo) this.ordenActiva = store.servicioActivo[0] || {};
        if( this.dataUser.carga ) this.query.where.tipoOrden = [ 0, 1 ];
        this.dataUser.estadoDisponible == true ? this.estado = true : this.estado = false;
        this.dataUser.carga === true ? this.cargaBolena =  true : this.cargaBolena = false;
    });
  }

  ngOnInit(): void {
    this.id = this.wsServices.idSocket;
    if( this.dataUser.estadoDisponible ) this.getList();
    this.getGeolocation();
    this.escucharSockets();
    if(Object.keys(this.ordenActiva).length > 0) this.openMapa({});

    var intervalID = window.setTimeout(()=>{
      this.segment.value = "SOLICITUDES";
    }, 200);

  }

  cambioView(ev:any){
    // console.log(ev);
    this.disableView = ev.detail.value;
    if( this.disableView == 'INGRESOS' ) this.getList2();
  }

  getGeolocation(){
    let vandera:boolean = true;
    setInterval(()=>{ 
      this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
        //console.log(geoposition)
        if(this.lat == geoposition.coords.latitude && this.lon == geoposition.coords.longitude ) return false;
        this.lat = geoposition.coords.latitude;
        this.lon = geoposition.coords.longitude;
        if(vandera){ this.crearMarcador() }
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
      if( !this.dataUser.estadoDisponible ) return false;
      //validar tipo de servicio si es normal o de carga
      if( marcador.tipoOrden == 1 ) if( !this.dataUser.carga ) return false;

      this.listRow.unshift(marcador);
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Solicitud servicio", text: `${ marcador['usuario'].nombre } Destino ${ marcador['titulo']} Ofrece $ ${ ( marcador['ofreceCliente'] || 0 ).toLocaleString(1) } COP` });
    });
    this.wsServices.listen('orden-confirmada')
    .subscribe((marcador: any)=> {
      //console.log(this.listRow, marcador);
      if(marcador.coductor.id == this.dataUser.id){
        let item = this.listRow.find( (row:any)=> row.id == marcador.id );
        item.check = true;
      }else{
        if(marcador.id) this.listRow = this.listRow.filter( (row:any) => row.id !== marcador.id );
      }
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
    });
  }

  dataFormaList(res:any){
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
    this._tools.presentLoading();
    this._orden.get(this.query2).subscribe((res:any)=>{
      // console.log(res);
      this.dataFormaList2(res);
      this._tools.dismisPresent();
    });
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
    }).then(modal=>modal.present());
  }

  habilitarCarga(){
    this.cargaBolena = !this.cargaBolena;
    let data:any = {
      id: this.dataUser.id,
      carga: this.cargaBolena
    };
    this.actualizarUser( data, 'carga');
  }
  
  cambioEstado(){
    this.estado = !this.estado;
    let data:any = {
      id: this.dataUser.id,
      estadoDisponible: this.estado
    };
    this.actualizarUser( data, 'estado');
  }

  actualizarUser( data:any, opt:string ){
    this._user.update( data ).subscribe(( res:any )=>{
      this.mensajesUser( opt, res);
      let accion = new PersonaAction( res, 'put');
      this._store.dispatch( accion );
    },( error:any )=> console.error( error ));
  }

  mensajesUser( opt:string, res:any){
    if( opt == 'carga'){
      this.query = {
        where:{
          estado: 0
        },
        skip: 0
      }
      if( res.carga ) { this._tools.presentToast("Activastes la opcion de carga "); this.query.where.tipoOrden = [ 0, 1 ]; }
      else { this._tools.presentToast("Inactivaste la opcion de carga "); this.query.where.tipoOrden = 0; }
      this.getList();
    }else{
      if( res.estadoDisponible ) this._tools.presentToast("Estado Activo");
      else this._tools.presentToast("Estado Inactivo");
    }

  }
  
}
