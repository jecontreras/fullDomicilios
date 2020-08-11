import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment } from '@ionic/angular';

@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.page.html',
  styleUrls: ['./cupones.page.scss'],
})
export class CuponesPage implements OnInit {
  
  listOpcion:any = ["ACTIVOS","NO DISPONIBLE"];
  view:string = "ACTIVOS";
  public query:any = {
    where: {},
    limit: 5,
    page: 0
  };
  @ViewChild("vistas", {static: false}) segment: IonSegment;

  constructor() { }

  ngOnInit() {
    setTimeout(()=> { this.segment.value = "ACTIVOS"; console.log( this.segment )}, 2000 );
  }

  cambioView( ev:any ){
    let select:any = ev.detail.value;
    this.view = select;
  }

}
