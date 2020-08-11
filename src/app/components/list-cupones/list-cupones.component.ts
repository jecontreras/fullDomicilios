import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-list-cupones',
  templateUrl: './list-cupones.component.html',
  styleUrls: ['./list-cupones.component.scss'],
})
export class ListCuponesComponent implements OnInit {
  
  listRow:any = [];
  @Input() query: any;
  ev:any = {};
  evScroll:any;
  loading:any;
  
  constructor(
    private _dataServe: DataService
  ) { }

  ngOnInit() {
    this.listRow = this._dataServe.dbs.listCupones;
    
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
    if( this.evScroll ) if( this.evScroll.target ) this.evScroll.target.complete()
    if(this.loading) this.loading.dismiss();
  }

  doRefresh(ev){
    this.ev = ev;
    this.getRow();
    
  }

  loadData(ev){
    console.log(ev);
    this.evScroll = ev;
    this.query.skip++;
    this.getRow();
  }

}