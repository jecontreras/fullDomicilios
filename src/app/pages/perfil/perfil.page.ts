import { Component, OnInit } from '@angular/core';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  
  dataUser:any = {};
  listMenus:any = [
    {
      icons: "chatbubble-ellipses-outline",
      titulo: "Chats",
      url: "/perfil"
    },
    {
      icons: "heart-outline",
      titulo: "Favoritos",
      url: "/perfil"
    },
    {
      icons: "laptop-outline",
      titulo: "Cupones",
      url: "/perfil"
    },
    {
      icons: "card-outline",
      titulo: "Forma de pago",
      url: "/perfil"
    },
    {
      icons: "notifications-outline",
      titulo: "Avisos",
      url: "/perfil"
    },
    {
      icons: "settings-outline",
      titulo: "Configuraciones",
      url: "/perfil"
    },
    {
      icons: "fast-food-outline",
      titulo: "Sugerir restarurante",
      url: "/perfil"
    },
    {
      icons: "medkit-outline",
      titulo: "Ayuda",
      url: "/perfil"
    },
    {
      icons: "planet-outline",
      titulo: "Únete con nosotros",
      url: "/perfil"
    },
  ]
  constructor(
    private _store: Store<STORAGES>,
  ) {
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona;
  });

  }

  ngOnInit() {
  }

}
