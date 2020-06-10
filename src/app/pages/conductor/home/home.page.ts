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
import { PersonaAction, ServicioActivoAction, ChatFinixAction } from 'src/app/redux/app.actions';
import { MapboxService, Feature } from 'src/app/service-component/mapbox.service';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/service-component/chat.service';
import { ChatDetalladoPage } from 'src/app/dialog/chat-detallado/chat-detallado.page';
import { DetallesEmpresarialPage } from 'src/app/dialog/detalles-empresarial/detalles-empresarial.page';
import { SolicitarPage } from 'src/app/dialog/solicitar/solicitar.page';
import { ChatEmpresarialPage } from 'src/app/dialog/chat-empresarial/chat-empresarial.page';

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
      // estadoOrden: [ 0, 3]
    },
    sort: 'createdAt DESC',
    skip: 0
  };
  
  queryEmpresarial:any = {
    where: { estado: [0, 2, 3], tipoOrden: 1 },
    sort: 'createdAt DESC',
    skip: 0
  }

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

  vandera:boolean = true;

  contadorChat:number = 0;
  listMandadosActivos:any = [];

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
    private router: Router,
  ) { 
    this._store.subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
        console.log(store);
        if( !store.servicioActivo ) store.servicioActivo = [];
        if( Object.keys( store.servicioActivo ).length > 0 ) this.ordenActiva = store.servicioActivo[0] || {};
        this.validanQueryUser();
        if( store.chatfinix ) if( Object.keys( store.chatfinix ).length > 0) this.cambiarEstadoChat( store.chatfinix );
    });
  }

  ngOnInit(): void {
    this.InitApp();
    var intervalID = window.setTimeout(()=>{
      this.segment.value = "home";
    }, 200);
  }

  validanQueryUser(){
    if(this.dataUser.rol) this.rolUser = this.dataUser.rol.rol;
    this.query2.where.or = [
      { emisor: this.dataUser.id },
      { reseptor: this.dataUser.id }
    ]
    //this.query = { where:{ estado: 0 }, skip: 0 };
  }

  cambiarEstadoChat( chat:any ){
    for( let is = 0; is < this.listRow2.length; is++ ){
      if( this.listRow2[is].id == chat.id) {
        this.listRow2[is].visto2 = true;
        this.actualizarChat( this.listRow2[is] );
      }
    }
    let accion:any = new ChatFinixAction( chat, 'delete');
    this._store.dispatch( accion );
    this.cambiaStateChat();
  }

  InitApp(){
    this._tools.dismisPresent();
    this.id = this.wsServices.idSocket;
    if(!this.id ) this.contador();
    else this.InitProceso();
  }

  contador(){
    this.interval = setInterval(()=>{
      this.InitProceso();
    },5000);
  }

  InitProceso( ){
    this.id = this.wsServices.idSocket;
    if(!this.id) {this._tools.presentToast("No hay Conexion"); return false;}
    this.getGeolocation();
    this.escucharSockets();
    // this._tools.presentLoading();
    this.getList2();
    clearInterval(this.interval);
    setTimeout(()=>{
      if( this.dataUser.estadoCuenta ) { this.getList();}
    },5000)
  }

  getSearchMyUbicacion(){
    this.mapboxService
      .search_wordLngLat(`${ this.lon },${ this.lat }`)
      .subscribe((features: Feature[]) => { });
  }

  getGeolocation(){
    this.vandera = true;
    setInterval(()=>{ 
      this.locationDande();
    }, 3000);
  }

  locationDande(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      //console.log(geoposition)
      if(this.lat == geoposition.coords.latitude && this.lon == geoposition.coords.longitude ) return false;
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
      const nuevoMarker = {
        id: this.id,
        lng: this.lon,
        lat: this.lat
      };
      this.wsServices.emit( 'marcador-mover', nuevoMarker);
      if(this.vandera){ this.crearMarcador(); this.getSearchMyUbicacion(); }
      this.vandera = false;
    });
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
      //console.log(marcador);
      if( this.rolUser === 'usuario' ) return false;
      // Validando estado si esta disponible 
      if( !this.dataUser.estadoCuenta ) return false;
      // if( !( this.RangoOrden( marcador) ) ) return false;
      if( marcador.tipoOrden == 1 ) return false;
      this.listRow.unshift(marcador);
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Solicitud de Mandados", text: `${ marcador['usuario'].nombre } Origen ${ marcador['origentexto'] } Destino ${ marcador['destinotext'] } Ofrece $ ${ ( marcador['ofreceCliente'] || 0 ).toLocaleString(1) } USD` });
    });

    this.wsServices.listen('orden-actualizada')
    .subscribe((marcador: any)=> {
      // console.log(">>>>>>>>>>>",marcador, this.listRow);
      if( !marcador ) return false;
      let filtro = this.listRow.findIndex( (row:any)=> row.id == marcador.id );
      if(filtro <= -1) return false;
      this.listRow[filtro] = marcador;
    });

    this.wsServices.listen('orden-confirmada')  
    .subscribe((marcador: any)=> {
      if( !marcador ) return false;
      if( !marcador.coductor ) return false;
      //console.log(this.listRow, marcador);
      this.procesoOrdenConfirmada( marcador );
    });
    
    this.wsServices.listen('orden-finalizada')
    .subscribe((marcador: any)=> {
      //console.log(marcador);
      //this.listRow = this.listRow.filter( (row:any) => row.id !== marcador.id );
      let filtro:any = _.findIndex( this.listRow, [ 'id', marcador.id ]);
      if( filtro >-0 ){
        this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Mandado Finalizado", text: `${ marcador['usuario'].nombre } Origen ${ marcador['origentexto'] } Destino ${ marcador['destinotext'] } Ofrece $ ${ ( marcador['ofreceCliente'] || 0 ).toLocaleString(1) } USD` });
        this.listRow[filtro].estado = marcador.estado;
      }
      for( let is = 0; is < this.listRow2.length; is++ ){
        if( this.listRow2[is].ordenes.id == marcador.id) {
          this.listRow2[is].visto2 = true;
          this.actualizarChat( this.listRow2[is] );
        }
      }
    });
    //Orden cancelada

    this.wsServices.listen('orden-cancelada')
    .subscribe((marcador: any)=> {
      //console.log( marcador , this.listRow );
      if( !marcador.id ) return false;
      this.listRow = this.listRow.filter( ( row:any )=> row.id !== marcador.id );
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Mandado Cancelado", text: `${ marcador['usuario'].nombre } Origen ${ marcador['origentexto'] } Destino ${ marcador['destinotext'] } Ofrece $ ${ ( marcador['ofreceCliente'] || 0 ).toLocaleString(1) } USD` });
    });
    // chat nuevo
    this.wsServices.listen('chat-nuevo')
    .subscribe((chat: any)=> {
      //console.log("**", chat);
      if(chat.reseptor.id !== this.dataUser.id && ( chat.ordenes )) return false;
      try {
        this.ProcesoChatPrincipal( chat );
      } catch (error) {
        //console.log(error);
      }
    });

  }

  ProcesoChatPrincipal( chat:any ){
    this._mensajes.get({
      where:{
        id: chat.chatPrincipal.id
      }
    }).subscribe((res:any)=>{
      res = res.data[0];
      if(!res) return false;
      this.listRow2.unshift( res );
      this.listRow2 = _.unionBy( this.listRow2 || [], res, 'id');
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Un nuevo mensaje", text: `Usuario: ${ chat['emisor'].nombre } del mandado: ${ chat['ordenes'].descripcion } mensaje:  ${ chat.text }` });
      this.cambiaStateChat();
    })
  }

  procesoOrdenConfirmada( marcador:any ){
    if(marcador.coductor.id == this.dataUser.id){
      //console.log( marcador );
      // mandado normal
      if( marcador.tipoOrden == 0 ){
        let item:any = _.findIndex( this.listRow, [ 'id', marcador.id ]); /*this.listRow.find( (row:any)=> row.id == marcador.id );*/
        //console.log(item, this.listRow, marcador);
        if( item < -0 ) return false;
        this.listRow[item] = marcador;
        this.listRow[item].check = true;
        item = this.listRow[item];
        this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Mandado Aceptado", text: `${ marcador['usuario'].nombre } Origen ${ marcador['origentexto'] } Destino ${ marcador['destinotext'] } Ofrece $ ${ ( marcador['ofreceCliente'] || 0 ).toLocaleString(1) } USD` }); 
      }
      // mandado empresarial
      else{
        let filtro:any = this.listMandadosActivos.find((row:any)=> row.id == marcador.id );
        if( !filtro ) this.listMandadosActivos.unshift( marcador );
        this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Mandado Empresarial Asignado", text: `${ marcador['usuario'].nombre } Origen ${ marcador['origentexto'] } Destino ${ marcador['destinotext'] } Ofrece $ ${ ( marcador['ofreceCliente'] || 0 ).toLocaleString(1) } USD` });
      }
    }else{
      if(marcador.id) this.listRow = this.listRow.filter( (row:any) => row.id !== marcador.id );
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Mandado no Acepatado", text: `${ marcador['usuario'].nombre } Origen ${ marcador['origentexto'] } Destino ${ marcador['destinotext'] } Ofrece $ ${ ( marcador['ofreceCliente'] || 0 ).toLocaleString(1) } USD` });
    }
    for( let row of this.listRow2 ){
      if( row.ordenes == marcador.id ) row.ordenes = marcador;
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
    //console.log( result );
    if( result <= 10000 ) return true;
    return false;
  }

  audioNotificando(obj:any, mensaje:any){
    // let sonido = new Audio();
    // sonido.src = obj;
    // sonido.load();
    // sonido.play();
    this._tools.presentNotificacion(mensaje);
  }

  doRefresh(ev ){
    this.ev = ev;
    this.disable_list = false;
    if( this.view == 'mandados' ) {
      this.listRow = [];
      this.query.skip = 0;
      this.getList();
    }
    if( this.view == 'chat' ){
      this.listRow2 = [];
      this.query2.skip = 0;
      this.getList2();
    }
    if( this.view == 'mandadosEmpresariales' ){
      this.listMandadosActivos = [];
      this.queryEmpresarial.skip = 0;
      this.getMandadosEmpresariales();
    }

  }

  loadData(ev){
    //console.log(ev);
    this.evScroll = ev;
    if( this.view == 'mandados' ){
      this.query.skip++;
      this.getList();
    }
    if( this.view == 'chat' ){
      this.query2.skip++;
      this.getList2();
    }
    if( this.view == 'mandadosEmpresariales' ){
      this.queryEmpresarial.skip++;
      this.getMandadosEmpresariales();
    }
  }

  getList(){
    delete this.query.where.estadoOrden;
    this.query.where.or = [
      { coductor: null},
      { coductor: this.dataUser.id }
    ];
    this._tools.presentLoading();
    this.query.where.tipoOrden = 0;
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
    this.listRow.push(...res.data );
    // console.log(this.listRow)
    this.listRow =_.unionBy(this.listRow || [], res.data, 'id');
    this.destruirProgreso();
  }

  getList2(){
    // this.query2.where.estadoOrden = 0;
    // this._tools.presentLoading();
    //this.query2.where.tipoOrden = 0;
    //this.query2.where.coductor = this.dataUser.id;
    this._mensajes.get(this.query2).subscribe((res:any)=>{
      // console.log(res);
      this.dataFormaList2(res);
      this._tools.dismisPresent();
    },(error)=> { this._tools.presentToast( "Error de conexion"); this._tools.dismisPresent(); });
  }

  dataFormaList2(res:any){
    this.listRow2.push(...res.data );
    this.listRow2 =_.unionBy(this.listRow2 || [], this.listRow2, 'id');
    this.destruirProgreso();
    this.cambiaStateChat();
  }
  
  openMapa( item:any ){
    let data:any = item || {};
    data.vista = "detalles";
    this.modalCtrl.create({
      component: SolicitarPage,
      componentProps: {
        obj: data
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

  openMandoEmpresarial( item:any ){
    let data:any = _.clone(item) || {};
    data.vista = "conductor";
    this.modalCtrl.create({
      component: DetallesEmpresarialPage,
      componentProps: {
        obj: data
      }
    }).then( async (modal)=>{
      modal.present();
      const { data } = await modal.onWillDismiss();
      this.listRow = [];
      this.query.skip = 0;
      console.log( data );
      if(!data.dismissed) item.estado = 2;
    });
  }

  openChat( item:any ){
    if(!item) return false;
    if(item.tipoOrden == 0){
      item.vista = "drive";
      if(!item.visto2) this.actualizarChat(item);
      item.visto2 = true;
      this.modalCtrl.create({
        component: ChatDetalladoPage,
        componentProps: {
          obj: item
        }
      }).then( async (modal)=>{
        modal.present();
        await modal.onWillDismiss();
      });
    }else this.openChatEmpresarial( item );
    this.cambiaStateChat();
  }

  async openChatEmpresarial( item:any ){
    item = _.clone(item);
    let orden:any = await this.getOrdenEmpresarialChat( item.ordenes.id );
    if( !orden ) return this._tools.presentToast("Error al abrir el chat");
    item = orden;
    item.vista = "cliente";
    item.visto = true;
    item.ordenes = item;
     this.modalCtrl.create({
       component: ChatEmpresarialPage,
       componentProps: {
         obj: item
       }
     }).then( async (modal)=>{
       modal.present();
       await modal.onWillDismiss();
       this.cambiaStateChat();
     });
   }
 
   getOrdenEmpresarialChat( id:any ){
     return new Promise( resolve=> {
       this._orden.get( { where: { id: id }, limit: 1}).subscribe(( res:any )=>{
         res = res.data[0];
         if( !res ) resolve( false );
         else resolve( res );
       });
     })
   }

  cambiaStateChat(){
    this.contadorChat = 0;
    for( let row of this.listRow2 ) if( !row.visto2 ) this.contadorChat++;
  }

  actualizarChat( obj:any ){
    let data:any = {
      id: obj.id,
      visto2: true
    };
    this._mensajes.editar(data).subscribe((res:any)=>console.log(res));
  }

  cambioVista( event:any ){
    this.view = event.detail.value;
    // if( this.view == 'chat' ) this.getList2();
  }

  verMandados(){
    this.view = "mandados";
  }
  
  verMandadosEmpresariales(){
    this.view = "mandadosEmpresariales"
    this.getMandadosEmpresariales();
  }

  getMandadosEmpresariales(){
    this._tools.presentLoading();
    this.queryEmpresarial.where.coductor = this.dataUser.id;
    this._orden.get( this.queryEmpresarial ).subscribe((res:any)=>{ 
      this.listMandadosActivos.push(...res.data );
      this.listMandadosActivos =_.unionBy(this.listMandadosActivos || [], this.listMandadosActivos, 'id');
      this.destruirProgreso();
    }, (err:any)=>{ this._tools.presentToast("Error de busqueda"); this._tools.dismisPresent(); })
  }
  
  destruirProgreso(){
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

  atras(){
    this.view = "home";
    this.segment.value = "home"
  }

  updateUser(){
    let data:any = {
      id: this.dataUser.id,
      email: this.dataUser.email,
      celular: this.dataUser.celular,
      direccion: this.dataUser.direccion
    };
    if(!data.id) return this._tools.presentLoading("Informacion no valida");
    this._tools.presentLoading();
    this._user.update(data).subscribe((res:any)=>{
      this._tools.presentToast("Actualizada la informacion");
      this._tools.dismisPresent();
      let accion = new PersonaAction(res, 'post');
      this._store.dispatch(accion);
    },(error:any)=>{ console.error(error); this._tools.presentToast("Error al actualizar"); this._tools.dismisPresent(); });
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
      this.wsServices.emit("drive", res);
    },(error)=> { console.error(error); this._tools.presentToast("Error de servidor"); this.disableEstado = false;})
  }
  
}
