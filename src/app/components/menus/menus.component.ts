import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss'],
})
export class MenusComponent implements OnInit {

  listMenu:any = [
    {
      titulo: "Inicio",
      icon: "home-outline"
    },
    {
      titulo: "Buscar",
      icon: "search-outline"
    },
    {
      titulo: "Pedidos",
      icon: "clipboard-outline"
    },
    {
      titulo: "Perfil",
      icon: "person-outline"
    }
  ];

  constructor() { }

  ngOnInit() {}

  cambioView( event:any ){
    console.log( event );
  }

}
