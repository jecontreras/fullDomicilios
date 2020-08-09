import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GruposCartaPage } from 'src/app/dialog/grupos-carta/grupos-carta.page';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  searchtxt:string = "";

  slideOpts = {
    slidesPerView: 1,
    freeMode: true
  };

  slideCosina = {
    slidesPerView: 3,
    freeMode: true
  };

  listCartas:any = [];

  listCocinas:any = [];

  listRestaurante:any = [];

  listMenu:any = [];

  constructor(
    private modalCtrl: ModalController,
    private _dataServe: DataService
  ) { }

  ngOnInit() {
    this.listCartas = this._dataServe.dbs.listCartas;
    this.listCocinas = this._dataServe.dbs.listCocinas;
    this.listRestaurante = this._dataServe.dbs.listRestaurante;
    this.listMenu = this._dataServe.dbs.listMenu;

    console.log( this.listRestaurante );
  }

  search( ){
    console.log( this.searchtxt );
  }

  openFiltro(){

  }

  async openGrupos( off ){
    const modal = await this.modalCtrl.create({
      component: GruposCartaPage,
      componentProps: {
        obj: off || {}
      },
    });
    modal.present();
  }

}
