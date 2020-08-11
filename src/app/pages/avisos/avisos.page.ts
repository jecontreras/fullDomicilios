import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.page.html',
  styleUrls: ['./avisos.page.scss'],
})
export class AvisosPage implements OnInit {
  
  listRow:any = [];
  @Input() query: any;
  ev:any = {};
  evScroll:any;
  loading:any;
  disable_list:boolean = false;

  constructor(
    private _dataServe: DataService
  ) { }

  ngOnInit() {
    this.listRow = this._dataServe.dbs.listAvisos;
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
    this.disable_list = true;
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
  view( item:any ){

  }

}
