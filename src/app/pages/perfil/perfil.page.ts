import { Component, OnInit } from '@angular/core';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  
  dataUser:any = {};
  listMenus:any = [];

  constructor(
    private _store: Store<STORAGES>,
    private _dataServe: DataService
  ) {
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona;
  });

  }

  ngOnInit() {
    this.listMenus = this._dataServe.dbs.listMenus;
  }

}
