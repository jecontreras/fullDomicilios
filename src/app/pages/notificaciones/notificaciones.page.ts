import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from 'src/app/service-component/notificaciones.service';
import { ToolsService } from 'src/app/services/tools.service';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfas/sotarage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as _ from 'lodash';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  listRow:any = [];
  query:any = {
    where:{
      estado: 0
    },
    skip: 0
  };

  public ev:any = {};
  public disable_list:boolean = true;
  public evScroll:any = {};
  public dataUser:any = {};

  constructor(
    private _notificaciones: NotificacionesService,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
    private iab: InAppBrowser,
  ) { 
    this._store.subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
    });
  }

  ngOnInit() {
    this.query.or = [
      { emisor: this.dataUser.id },
      { reseptor: this.dataUser.id }
    ];
    this.getList();
  }
  
  doRefresh(ev){
    this.ev = ev;
    this.disable_list = false;
    this.listRow = [];
    this.getList();
  }

  loadData(ev){
    //console.log(ev);
    this.evScroll = ev;
    this.query.skip++;
    this.getList();
  }

  getList(){
    this._tools.presentLoading();
    this._notificaciones.get(this.query).subscribe((res:any)=>{
      this.dataFormaList(res);
      this._tools.dismisPresent();
    });
  }

  dataFormaList(res:any){
    this.listRow.push(...res.data );
    console.log(this.listRow)
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

  abrirEnlace( obj:any ){
    const browser = this.iab.create(obj.link, '_system');
  }

}
