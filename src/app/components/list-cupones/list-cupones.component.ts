import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-cupones',
  templateUrl: './list-cupones.component.html',
  styleUrls: ['./list-cupones.component.scss'],
})
export class ListCuponesComponent implements OnInit {
  
  listRow:any = [
    {
      titulo: "Tienes $5.000",
      subtitulo: "Asi pides #ComoTeGusta",
      expira: new Date(),
      expirtaDes: "La validez ha expirado",
      estado: "finalizado"
    },
    {
      titulo: "Tienes $4.000",
      subtitulo: "Asi pides #ComoTeGusta",
      expira: new Date(),
      expirtaDes: "La validez ha expirado",
      estado: "finalizado"
    },
    {
      titulo: "Tienes $4.000",
      subtitulo: "Asi pides #ComoTeGusta",
      expira: new Date(),
      expirtaDes: "La validez ha expirado",
      estado: "finalizado"
    },
  ];
  @Input() query: any;
  
  constructor() { }

  ngOnInit() {}

}
