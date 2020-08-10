import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.page.html',
  styleUrls: ['./cupones.page.scss'],
})
export class CuponesPage implements OnInit {
  
  listOpcion:any = ["ACTIVOS","NO DISPONIBLE"];
  view:string = "ACTIVOS";
  query:any = {
    where: {}
  };
  constructor() { }

  ngOnInit() {
  }

  cambioView( ev:any ){
    let select:any = ev.detail.value;
    this.view = select;
  }

}
