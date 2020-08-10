import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ToolsService } from 'src/app/services/tools.service';
import { CalificacionPage } from '../calificacion/calificacion.page';

@Component({
  selector: 'app-detallepedido',
  templateUrl: './detallepedido.page.html',
  styleUrls: ['./detallepedido.page.scss'],
})
export class DetallepedidoPage implements OnInit {
  
  data:any = {
    empresa: { }
  };
  listArticulos:any = [];

  constructor(
    private modalCtrl: ModalController,
    private navparams: NavParams,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.data = this.navparams.get('obj');
  }

  openMenu(){

  }

  cerrarCompra(){

  }

  openArticulo( item ){

  }

  async openCalificar(){
    const modal = await this.modalCtrl.create({
      component: CalificacionPage,
      componentProps: {
        obj: this.data
      },
    });
    modal.present();
  }

  exit(){
    this.modalCtrl.dismiss();
  }

}
