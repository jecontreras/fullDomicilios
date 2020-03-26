import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portada',
  templateUrl: './portada.page.html',
  styleUrls: ['./portada.page.scss'],
})
export class PortadaPage implements OnInit {
  
  sliderOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor() { }

  ngOnInit() {
    //location.reload();
  }
  
  ingresar(){
    
  }

  registrar(){

  }

  ayuda(){
    
  }
}
