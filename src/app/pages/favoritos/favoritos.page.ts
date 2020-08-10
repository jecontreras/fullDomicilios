import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  lisFiltro:any = [];
  listRow:any = [];
  tipoPlato:string = "TIPICA";
  ev:any = {};
  evScroll:any;
  query:any = {};
  loading:any;
  dataUser:any = {};

  constructor(
    private _dataServe: DataService,
    private _store: Store<STORAGES>,
  ) { 
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona;
    });
  }

  ngOnInit() {
    this.listRow = this._dataServe.dbs.listFavoritos;
  }

  cambios(){

  }

  getRow(){
    this.completado();
  }

  completado(){
    if(this.ev){
      if(this.ev.target){
        this.ev.target.complete();
      }
    }
    if( this.evScroll.target ){
      this.evScroll.target.complete()
    }
    if(this.loading) this.loading.dismiss();
  }

  doRefresh(ev){
    this.ev = ev;
    this.getRow();
    
  }

  loadData(ev){
    //console.log(ev);
    this.evScroll = ev;
    this.query.skip++;
    this.getRow();
  }

}
