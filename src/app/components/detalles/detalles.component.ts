import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss'],
})
export class DetallesComponent implements OnInit {
  
  @Input() detalle: any = {};

  data:any = { horarios: {} };
  constructor() { 
  }

  ngOnInit() {
    console.log( this.detalle)
    this.data = this.detalle;
  }

}
