import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-platos',
  templateUrl: './platos.page.html',
  styleUrls: ['./platos.page.scss'],
})
export class PlatosPage implements OnInit {
  
  lisFiltro:any = [];
  listRow:any = [
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000",
      id: 1
    },
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000",
      id: 2
    },
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000",
      id: 3
    },
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000",
      id: 4
    },
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000",
      id: 5
    },
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000",
      id: 6
    },
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000",
      id: 7
    }
  ];
  tipoPlato:string = "TIPICA";
  ev:any = {};
  evScroll:any;
  query:any = {};
  loading:any;

  constructor() { }

  ngOnInit() {
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
