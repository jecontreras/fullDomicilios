import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss'],
})
export class BuscadorComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private _tools: ToolsService,
    private _store: Store<STORAGES>,
  ) { }

  textoBuscar = "";
  query:any = {
    where:{
      estado: 0
    },
    skip: 0
  };
  listProductos:any = [];
  evScroll:any = {};
  ev:any = {};
  disable_list:boolean = true;
  listCategorias:any = [];

  ngOnInit() {
  }
  loadData(ev){
      //console.log(ev);
      this.evScroll = ev;
      this.query.skip++;
  }

  salir(){
    this.modalCtrl.dismiss();
  }


  cambioCategoria(ev:any){
    let data:any = ev.detail.value;
    this.query.where.idSubCategoria = data.idSubcategoria;
    this.listProductos = [];
  }

  buscar(ev){
    console.log(ev);
    this.textoBuscar = ev.detail.value;
    if(this.textoBuscar.length >= 1){
      this.query.where.or = [
        {
          titulo:{
            contains: this.textoBuscar || ''
          }
        },
        {
          slug:{
            contains: _.kebabCase(this.textoBuscar) || ''
          }
        }
      ];
    }else{
      delete this.query.where.or;
    }

    //this.getProductos();
  }
}
