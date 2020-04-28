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
import { PersonaAction } from 'src/app/redux/app.actions';
import { Router } from '@angular/router';
import { ChatDetalladoPage } from 'src/app/dialog/chat-detallado/chat-detallado.page';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Lugar } from 'src/app/interfas/interfaces';

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

  listRow:any = [];
  query:any = {
    where:{
      estado: 0
    },
    sort: 'createdAt DESC',
    skip: 0
  };
  public ev:any = {};
  public disable_list:boolean = true;
  public evScroll:any = {};

  @ViewChild(IonSegment, {static: false}) segment: IonSegment;

  seconds:any = 0;
  lat:number;
  lon:number;

  public rolUser:string;


  constructor(
    private wsServices: WebsocketService,
    private _store: Store<PERSONA>,
    private _tools: ToolsService,
    private modalCtrl: ModalController,
    private _mensajes: ChatService,
    private geolocation: Geolocation,
    private router: Router
  ) { 
    (Mapboxgl as any).accessToken = environment.mapbox.accessTokens;
    this._store.subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
        if( this.dataUser ) this.dataUser.celular = this.dataUser.indicativo+this.dataUser.celular;
        if(this.dataUser.rol) this.rolUser = this.dataUser.rol.rol;
    });
  }

  ngOnInit(): void {
    this.InitApp();
  }

  ionViewDidLeave(){
    console.log(4)
    this.banderaRefres = true;
  }

  InitApp(){
    this.id = this.wsServices.idSocket;
    this.InitProceso();
    if( !this.id ) this.contador();
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
    clearInterval(this.interval);
  }

  escucharSockets(){
    // marcador-nuevo
    // this.wsServices.listen('marcador-nuevo')
    // .subscribe((marcador: Lugar)=> {
    //   // console.log(marcador)
    // });
  }

  getGeolocation(){
    let vandera:boolean = true;
    setInterval(()=>{ 
      this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
        if(this.lat == geoposition.coords.latitude && this.lon == geoposition.coords.longitude ) return false;
        this.lat = geoposition.coords.latitude;
        this.lon = geoposition.coords.longitude;
        if(vandera){ this.crearMarcador();}
        this.seconds = 5000;
      },this.seconds);
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
    if( this.view == 'chat' ) this.getList();
  }

  atras(){
    this.view = "home";
    this.segment.value = "home"
  }

  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.listRow = [];
    this.query.skip = 0;
    this.getList();
  }

  loadData(ev){
    //console.log(ev);
    this.evScroll = ev;
    this.query.skip++;
    this.getList();
  }

  getList(){
    this.query.where.estadoOrden = 0;
    this._tools.presentLoading();
    this._mensajes.get(this.query).subscribe((res:any)=>{
      // console.log(res);
      this.dataFormaList(res);
      this._tools.dismisPresent();
    },(error)=> { this._tools.presentToast( "Error de conexion"); this._tools.dismisPresent(); });
  }

  dataFormaList(res:any){
    this.listRow.push(...res.data );
    this.listRow =_.unionBy(this.listRow || [], this.listRow, 'id');
    if( this.evScroll.target ) this.evScroll.target.complete()
    if(this.ev){
      this.disable_list = true;
      if(this.ev.target){
        this.ev.target.complete();
      }
    }
  }

  openSolicitar(){
    this.modalCtrl.create({
      component: SolicitarPage,
      componentProps: {}
    }).then( async (modal)=>{
      modal.present();
    });
  }

  openChat( item:any ){
    if(!item) return false;
    this.modalCtrl.create({
      component: ChatDetalladoPage,
      componentProps: {
        obj: item
      }
    }).then( async (modal)=>{
      modal.present();
    });
  }

  openInformacion(){
    this.view = 'informacion';
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
