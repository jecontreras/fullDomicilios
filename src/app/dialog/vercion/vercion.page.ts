import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vercion',
  templateUrl: './vercion.page.html',
  styleUrls: ['./vercion.page.scss'],
})
export class VercionPage implements OnInit {

  sliderOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };
  
  constructor() { }

  ngOnInit() {
  }

}
