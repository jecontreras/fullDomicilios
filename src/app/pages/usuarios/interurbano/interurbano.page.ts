import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment } from '@ionic/angular';

@Component({
  selector: 'app-interurbano',
  templateUrl: './interurbano.page.html',
  styleUrls: ['./interurbano.page.scss'],
})
export class InterurbanoPage implements OnInit {

  data:any = {};
  listPage:any = ["ENCONTRAR UN VIAJE","MIS VIAJES"];
  disableView:string = "ENCONTRAR UN VIAJE";
  listViajes:any = [];

  @ViewChild(IonSegment, {static: false}) segment: IonSegment;

  constructor() { }

  ngOnInit() {
    var intervalID = window.setTimeout(()=>{
      this.segment.value = "ENCONTRAR UN VIAJE";
    }, 200);
  }
  
  cambioView(ev:any){
    // console.log(ev);
    this.disableView = ev.detail.value;
  }

  submitViaje(){
    
  }

}
