import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-platos',
  templateUrl: './platos.page.html',
  styleUrls: ['./platos.page.scss'],
})
export class PlatosPage implements OnInit {
  
  lisFiltro:any = [];
  listRow:any = [];
  tipoPlato:string = "TIPICA";
  ev:any = {};
  evScroll:any;
  query:any = {};
  loading:any;

  constructor(
    private _dataServe: DataService
  ) { }

  ngOnInit() {
    this.listRow = this._dataServe.dbs.listRestaurante;
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
