import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  
  ListRow:any = [];
  view:string = "CONFIGURACIÓN";
  data:any = {};
  view2:string;
  avisos:any = {
    terminos: "Esto es una prueba de terminos",
    aviso: "Esto es una prueba de aviso"
  };

  constructor(
    private _DataServe: DataService,
    private _store: Store<STORAGES>,
  ) { 
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.data = store.persona;
  });
  }

  ngOnInit() {
    this.ListRow = this._DataServe.dbs.listConfigurarciones;
  }

  openView( item:any ){
    this.view = item.id;
  }
  openView2( item:string ){
    this.view2 = item;
  }

}
