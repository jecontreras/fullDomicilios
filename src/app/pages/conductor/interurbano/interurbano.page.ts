import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { ToolsService } from 'src/app/services/tools.service';
import { PERSONA } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { OrdenProgramadosService } from 'src/app/service-component/orden-programados.service';
import * as _ from 'lodash';
import { OfertandoService } from 'src/app/service-component/ofertando.service';
import { WebsocketService } from 'src/app/services/websocket.services';

@Component({
  selector: 'app-interurbano',
  templateUrl: './interurbano.page.html',
  styleUrls: ['./interurbano.page.scss'],
})
export class InterurbanoPage implements OnInit {

  data:any = {};
  listPage:any = ["VIAJES ACTIVOS", "NOTIFICACIONES"];
  disableView:string = "VIAJES ACTIVOS";
  query:any = {
    where:{
      estado: 0
    },
    skip: 0
  };

  @ViewChild(IonSegment, {static: false}) segment: IonSegment;

  listRow:any = [];
  public ev:any = {};
  public disable_list:boolean = true;
  public evScroll:any = {};  
  dataUser:any = {};
  disableDetalle:boolean = false;
  disableBtnOfreciendo:boolean = false;

  constructor(
    private _tools: ToolsService,
    private _store: Store<PERSONA>,
    private _ordenProgramados: OrdenProgramadosService,
    private _ofertando: OfertandoService,
    private wsServices: WebsocketService
  ) { 
    this._store.subscribe(( store:any )=>{
      store = store.name;
      this.dataUser = store.persona || {};
    });
  }

  ngOnInit() {
    var intervalID = window.setTimeout(()=>{
      this.segment.value = "VIAJES ACTIVOS";
    }, 200);
    this.getViajesProgramados();
    this.escucharSockets();
  }

  escucharSockets(){
    // marcador-nuevo
    this.wsServices.listen('orden-programada-creado')
    .subscribe((marcador: any)=> {
       console.log(marcador);
       this.listRow.unshift( marcador );
    });

  }
  
  cambioView(ev:any){
    // console.log(ev);
    this.disableView = ev.detail.value;
  }

  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.listRow = [];
    this.getViajesProgramados();
  }

  loadData(ev){
    //console.log(ev);
    this.evScroll = ev;
    this.query.skip++;
    this.getViajesProgramados();
  }

  getViajesProgramados(){
    this._tools.presentLoading();
    this._ordenProgramados.get(this.query).subscribe(( res:any )=>{
      this.dataFormaList(res);
      this._tools.dismisPresent();
    });
  }

  dataFormaList(res:any){
    this.listRow.push(...res.data );
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

  submitOfreciendo(){
    let data:any = {
      usuario: this.dataUser.id,
      ordenProgramada: this.data.id,
      ofrece: this.data.ofreces,
      descripcion: this.data.descripcion
    };
    if( !data.ofrece ) return this._tools.presentToast("Error Precio no establecido");
    this.disableBtnOfreciendo = true;
    this._ofertando.saved( data ).subscribe((res:any)=>{
      this.wsServices.emit( 'ofreciendo-orden-programada', res);
      this._tools.presentToast("Ofertando exitoso");
      this.data = {};
      this.disableDetalle = false;
      this.disableBtnOfreciendo = false;
      for(let row of this.listRow) row.check = false;
    },(error:any)=>{ this._tools.presentToast("Error al ofertar"); this.disableBtnOfreciendo = false; });
  }

  OpenServicio( item:any ){
    this.data = item;
  }

  OcultarDetalle(){
    this.disableDetalle = false;
  }

}
