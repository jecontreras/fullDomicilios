import { Component, OnInit, ViewChild } from '@angular/core';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { WebsocketService } from 'src/app/services/websocket.services';
import { Store } from '@ngrx/store';
import { PERSONA } from 'src/app/interfas/sotarage';
import { ToolsService } from 'src/app/services/tools.service';
import { ModalController, IonSegment } from '@ionic/angular';
import { SolicitarPage } from 'src/app/dialog/solicitar/solicitar.page';
import { ChatService } from 'src/app/service-component/chat.service';
import * as _ from 'lodash'
import { PersonaAction, ChatFinixAction } from 'src/app/redux/app.actions';
import { Router } from '@angular/router';
import { ChatDetalladoPage } from 'src/app/dialog/chat-detallado/chat-detallado.page';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Lugar } from 'src/app/interfas/interfaces';
import { OrdenesService } from 'src/app/service-component/ordenes.service';
import { UserService } from 'src/app/services/user.service';
import { EmpresarialPage } from 'src/app/dialog/empresarial/empresarial.page';
import { DetallesEmpresarialPage } from 'src/app/dialog/detalles-empresarial/detalles-empresarial.page';
import { ChatEmpresarialPage } from 'src/app/dialog/chat-empresarial/chat-empresarial.page';
import { MapboxService } from 'src/app/service-component/mapbox.service';
import { resolve } from 'url';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  dataUser:any = {};
  id:string;
  banderaRefres:boolean = false;
  interval:any;
  view:string = "home";

  vandera:boolean = true;

  listRow:any = [];
  query:any = {
    where:{
      estado: 0
    },
    sort: 'createdAt desc',
    skip: 0
  };
  query3:any = {
    where: { estado: [0, 3, 2], tipoOrden: 1 }
  }
  public ev:any = {};
  public disable_list:boolean = true;
  public evScroll:any = {};

  @ViewChild(IonSegment, {static: false}) segment: IonSegment;

  seconds:any = 0;
  lat:number;
  lon:number;

  public rolUser:string;

  listMandadosActivos:any = [];
  listMandadosEmpreasaActivos:any = [];
  btnDisabled:boolean = false;
  contadorChat:number= 0;

  constructor(
    private wsServices: WebsocketService,
    private _store: Store<PERSONA>,
    private _tools: ToolsService,
    private modalCtrl: ModalController,
    private _mensajes: ChatService,
    private geolocation: Geolocation,
    private router: Router,
    private _ordenes: OrdenesService,
    private _user: UserService,
    private mapboxService: MapboxService
  ) { 
    (Mapboxgl as any).accessToken = environment.mapbox.accessTokens;
    this._store.subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
        if( this.dataUser ) this.dataUser.celular = this.dataUser.indicativo+this.dataUser.celular;
        if( this.dataUser.rol ) this.rolUser = this.dataUser.rol.rol;
        if( store.chatfinix ) if( Object.keys( store.chatfinix ).length > 0) this.cambiarEstadoChat( store.chatfinix );
    });
  }

  ngOnInit(): void {
    this.InitApp();
  }

  ionViewDidLeave(){
    console.log(4)
    this.banderaRefres = true;
  }

  cambiarEstadoChat( chat:any ){
    for( let is = 0; is < this.listRow.length; is++ ){
      if( this.listRow[is].id == chat.id) {
        this.listRow[is].visto2 = true;
        this.actualizarChat( this.listRow[is] );
      }
    }
    let accion:any = new ChatFinixAction( chat, 'delete');
    this._store.dispatch( accion );
    this.cambiaStateChat()
  }

  InitApp(){
    this._tools.dismisPresent();
    this.id = this.wsServices.idSocket;
    if( !this.id ) this.contador();
    else this.InitProceso();
  }

  contador(){
    this.interval = setInterval(()=>{
      this.InitProceso();
    },5000);
  }

  InitProceso( ){
    this.id = this.wsServices.idSocket;
    if(!this.id) { this._tools.presentToast("No hay Conexion"); return false;}
    this.escucharSockets();
    this.getGeolocation();
    this._tools.presentLoading();
    this.getList();
    clearInterval(this.interval);
  }

  escucharSockets(){
    this.wsServices.listen('chat-principal')
    .subscribe((marcador: any)=> {
      //console.log("**", marcador);
      if( !marcador.reseptor ) return false;
      if( marcador.reseptor.id !== this.dataUser.id ) return false;
      this.listRow.unshift( marcador );
      this.listRow = _.unionBy( this.listRow || [], marcador, 'id');
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Nuevo Mensaje de tu mandado", text: `Nuevo mensaje de ${ marcador['emisor'].nombre } ${ marcador['emisor'].apellido } Ofrece $ ${ ( marcador['ofertando'].ofrece || 0 ).toLocaleString("en-US", { style: 'currency', currency: 'USD' }) } ` });
      this.cambiaStateChat();
    });

    this.wsServices.listen('chat-nuevo')
    .subscribe((chat: any)=> {
      // console.log("**", chat, this.listRow);
      if( !chat.chatPrincipal ) return false;
      if( chat.chatPrincipal.reseptor !== this.dataUser.id ) return false;
      this.ProcesoChatPrincipal( chat );
    });

    this.wsServices.listen('orden-finalizada')
    .subscribe((marcador: any)=> {
      //console.log(marcador);
      if( !marcador ) return false;
      let filtro:any = _.findIndex( this.listMandadosEmpreasaActivos, [ 'id', marcador.id ]);
      if( filtro >= 0 ){
        this.listMandadosEmpreasaActivos[filtro] = marcador;
        this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Mandado Finalizado", text: `${ marcador['coductor'].nombre } Origen ${ marcador['origentexto'] } Destino ${ marcador['destinotext'] } Ofrece $ ${ ( marcador['ofreceCliente'] || 0 ).toLocaleString(1) } USD` });
      }
      for( let i = 0; i <this.listRow.length; i++ ){
        if( this.listRow[i].ordenes.id == marcador.id) {
          this.listRow[i].visto = true;
          this.actualizarChat( this.listRow[i] );
        }
      }
    });

    this.wsServices.listen('orden-confirmada')  
    .subscribe((marcador: any)=> {
      if( !marcador ) return false;
      if( !marcador.coductor ) return false;
      //console.log(this.listRow, marcador);
      this.procesoOrdenConfirmada( marcador );
    });

    this.wsServices.listen('orden-cancelada')
    .subscribe(async (marcador: any)=> {
      console.log(marcador); 
      if( !marcador.id ) return false;
      let filtro:any = _.findIndex( this.listMandadosEmpreasaActivos, [ 'id', marcador.id ]);
      if( filtro >=0 ) this.listMandadosEmpreasaActivos[filtro] = marcador;
      if( !marcador.idChat ) return false;
      this.listRow = this.listRow.filter( ( row:any ) => row.id !== marcador.idChat );
      this.cambiaStateChat();
    });
  }
  
  getSearchMyUbicacion(){
    this.mapboxService
      .search_wordLngLat(`${ this.lon },${ this.lat }`)
      .subscribe((features: any) => { });
  }

  procesoOrdenConfirmada( marcador:any ){
    //console.log( marcador , this.listMandadosEmpreasaActivos, marcador.usuario.id == this.dataUser.id);
    if(marcador.usuario.id == this.dataUser.id){
      // mandado Empresarial
      if( marcador.tipoOrden == 1 ){
        let idx:any = _.findIndex( this.listMandadosEmpreasaActivos, [ 'id', marcador.id ]);
        //console.log(idx);
        if( idx >= 0 ){
          this.listMandadosEmpreasaActivos[idx] = marcador;
          this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Mandado Empresarial Asignado", text: `${ marcador['coductor'].nombre } Origen ${ marcador['origentexto'] } Destino ${ marcador['destinotext'] } Ofrece $ ${ ( marcador['ofreceCliente'] || 0 ).toLocaleString(1) } USD` });
        }
      }
    }
    for( let row of this.listRow ){
      if( row.ordenes == marcador.id ) row.ordenes = marcador;
    }
  }

  ProcesoChatPrincipal( chat:any ){
    this._mensajes.get({
      where:{
        id: chat.chatPrincipal.id,
        estado: 0
      }
    }).subscribe((res:any)=>{
      res = res.data[0];
      if(!res) return false;
      this.listRow.unshift( res );
      this.listRow = _.unionBy( this.listRow || [], res, 'id');
      // console.log(this.listRow);
      this.audioNotificando('./assets/sonidos/notificando.mp3', { titulo: "Nuevo Mensaje de tu mandado", text: `Nuevo mensaje de ${ res['emisor'].nombre } ${ res['emisor'].apellido } ` });
      this.cambiaStateChat();
    })
  }

  audioNotificando(obj:any, mensaje:any){
    // let sonido = new Audio();
    // sonido.src = obj;
    // sonido.load();
    // sonido.play();
    this._tools.presentNotificacion(mensaje);
  }

  getGeolocation(){
    this.vandera = true;
    setInterval(()=>{ 
      this.locationDande();
    }, 3000);
  }

  locationDande(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
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
      this.seconds = 5000;
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

  cambioVista( event:any ){
    this.view = event.detail.value;
    // if( this.view == 'chat' ) this.getList();
  }

  atras(){
    this.view = "home";
    this.segment.value = "home"
  }

  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    if(this.view == 'chat'){
      this.listRow = [];
      this.contadorChat = 0;
      this.query.skip = 0;
      this.getList();
    }
    if(this.view == 'mandadosEmpresarial'){
      this.listMandadosEmpreasaActivos = [];
      this.query3.skip = 0;
      this.openMandadosEmpresarialActivos();
    }
  }

  loadData(ev){
    //console.log(ev);
    this.evScroll = ev;
    if(this.view == 'chat'){
      this.query.skip++;
      this.getList();
    }
    if(this.view == 'mandadosEmpresarial'){
      this.query3.skip++;
      this.openMandadosEmpresarialActivos();
    }
  }

  getList(){
    // this.query.where.estadoOrden = 0;
    this.query.where.or = [
      { emisor: this.dataUser.id },
      { reseptor: this.dataUser.id }
    ];
    //this.query.where.tipoOrden = 0;
    this._mensajes.get(this.query).subscribe((res:any)=>{
      // console.log(res);
      this.dataFormaList(res);
      this._tools.dismisPresent();
    },(error)=> { this._tools.presentToast( "Error de conexion"); this._tools.dismisPresent(); });
  }

  dataFormaList(res:any){
    this.listRow.push(...res.data );
    this.listRow =_.unionBy(this.listRow || [], this.listRow, 'id');
    this.contadorChat = 0;
    this.destruirProceso();
    this.cambiaStateChat();
  }

  destruirProceso(){
    if( this.evScroll.target ) this.evScroll.target.complete()
    if(this.ev){
      this.disable_list = true;
      if(this.ev.target){
        this.ev.target.complete();
      }
    }
  }

  openSolicitar( item:any ){
    let data:any = {
      vista: "form"
    };
    if(item) { data = item; data.vista = "form"; }
    this.modalCtrl.create({
      component: SolicitarPage,
      componentProps: { 
        obj: data
      }
    }).then( async (modal)=>{
      modal.present();
    });
  }

  openEmpresarial( item:any ){
    let data:any = _.clone(item) || {};
    if(!item) data.vista = "crear";
    else data.vista = "update";
    this.modalCtrl.create({
      component: EmpresarialPage,
      componentProps: { 
        obj: data
      }
    }).then( async (modal)=>{
      modal.present();
      const { data } = await modal.onWillDismiss();
      if( data.dismissed ) this.listMandadosEmpreasaActivos.unshift( data.dismissed );
    });
  }
  async openEmpresarialVer( item:any ){
    let data:any = _.clone(item) || {};
    this.btnDisabled = true;
    data = await this.getEmpresarial( data );
    this.btnDisabled = false;
    if( !data ) { this.listMandadosEmpreasaActivos =this.listMandadosEmpreasaActivos.filter( ( row:any )=> row.id !== item.id ); return this._tools.presentToast( "lo sentimos este mandado empresarial no esta disponible!"); }
    data.vista = "usuario";
    this.modalCtrl.create({
      component: DetallesEmpresarialPage,
      componentProps: { 
        obj: data
      }
    }).then( async (modal)=>{
      modal.present();
    });
  }

  async getEmpresarial( data:any ){
    return new Promise( resolve => {
      this._ordenes.get( { where: { id: data.id, usuario: this.dataUser.id }, limit: 1 }).subscribe((res:any)=>{
        res = res.data[0];
        if( !res ) return resolve( false );
        else return resolve( res );
      },(erro:any)=> this.btnDisabled = false );
    });
  }

  openMandadosActivos(){
    this.view = "mandados";
    this._tools.presentLoading();
    this._ordenes.get( { where: { estado: [0, 3], usuario: this.dataUser.id, tipoOrden: 0 } } ).subscribe((res:any)=>{ 
      this.listMandadosActivos = res.data
      this._tools.dismisPresent();
      this.destruirProceso();
    }, (err:any)=>{ this._tools.presentToast("Error de busqueda"); this._tools.dismisPresent(); })
  }

  openMandadosEmpresarialActivos(){
    this.view = "mandadosEmpresarial";
    this._tools.presentLoading();
    this.query3.where.usuario = this.dataUser.id;
    this.query3.sort = 'createdAt desc';
    this._ordenes.get( this.query3 ).subscribe((res:any)=>{ 
      this.listMandadosEmpreasaActivos.push(...res.data );
      this.listMandadosEmpreasaActivos =_.unionBy(this.listMandadosEmpreasaActivos || [], this.listMandadosEmpreasaActivos, 'id');
      this._tools.dismisPresent();
      this.destruirProceso();
    }, (err:any)=>{ this._tools.presentToast("Error de busqueda"); this._tools.dismisPresent(); })
  }

  openChat( item:any ){
    if(!item) return false;
    item.vista = "cliente";
    if(!item.visto) this.actualizarChat(item);
    item.visto = true;
    if( item.tipoOrden == 0 ){
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
      this._ordenes.get( { where: { id: id }, limit: 1}).subscribe(( res:any )=>{
        res = res.data[0];
        if( !res ) resolve( false );
        else resolve( res );
      });
    })
  }

  cambiaStateChat(){
    this.contadorChat = 0;
    for( let row of this.listRow ) if( !row.visto ) this.contadorChat++;
  }

  actualizarChat( obj:any ){
    let data:any = {
      id: obj.id,
      visto: true
    };
    this._mensajes.editar(data).subscribe((res:any)=>console.log(res));
  }

  openInformacion(){
    this.view = 'informacion';
  }

  cancelarMandado(obj:any){
    let data:any = {
      id: obj.id,
      estado: 1
    };
    if(!data.id) return this._tools.presentToast("Error el item no encontrado");
    this.btnDisabled = true;
    this._ordenes.editar( data ).subscribe((res:any)=>{
      this._tools.presentToast("Mandado Cancelado");
      this.btnDisabled = false;
      this.listMandadosActivos = this.listMandadosActivos.filter((row:any)=> row.id != obj.id );
      this.wsServices.emit("orden-cancelada", res);
    },(error)=> { this._tools.presentToast("Error al cancelar intentelo mas tarde"); this.btnDisabled = false; } )
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
      console.log(res);
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

}
