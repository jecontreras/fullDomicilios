import { Component, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/service-component/ordenes.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  listRow:any = [];
  query:any = {
    where:{
      estado: 2
    },
    skip: 0
  };

  public ev:any = {};
  public disable_list:boolean = true;
  public evScroll:any = {};

  constructor(
    private _orden: OrdenesService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
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

}
