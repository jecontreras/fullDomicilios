import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment } from '@ionic/angular';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.page.html',
  styleUrls: ['./carga.page.scss'],
})
export class CargaPage implements OnInit {

  listPage:any = ["SOLICITAR","AUTOS CERCA","MIS VIAJES"];
  disableView:string = "SOLICITAR";

  @ViewChild(IonSegment, {static: false}) segment: IonSegment;

  data:any = {};
  listAutos:any = [];
  listViajes:any = [];

  constructor() { }

  ngOnInit() {
    var intervalID = window.setTimeout(()=>{
      this.segment.value = "SOLICITAR";
    }, 200);
  }
  
  cambioView(ev:any){
    // console.log(ev);
    this.disableView = ev.detail.value;
  }

  submit(){

  }

}
