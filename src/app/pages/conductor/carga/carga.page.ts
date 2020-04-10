import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { OrdenesService } from 'src/app/service-component/ordenes.service';
import { PERSONA } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.page.html',
  styleUrls: ['./carga.page.scss'],
})
export class CargaPage implements OnInit {

  listRow:any = [];
  query:any = {
    where:{
      estado: 2,
      tipoOrden: 1
    },
    skip: 0
  };

  public ev:any = {};
  public disable_list:boolean = true;
  public evScroll:any = {};
  public dataUser:any = {};
  public rolUser:string;

  constructor(
    private _orden: OrdenesService,
    private _tools: ToolsService,
    private _store: Store<PERSONA>,
  ) { 

    this._store.subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona;
        if(this.dataUser.rol) this.rolUser = this.dataUser.rol.rol;
    });

  }

  ngOnInit() {
      if(this.rolUser == 'usuario') this.query.where.usuario = this.dataUser.id;
      if(this.rolUser == 'conductor') this.query.where.coductor = this.dataUser.id;

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
    this._orden.get(this.query).subscribe((res:any)=>{
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

}
