import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class DetalleProductoPage implements OnInit {
  data:any = {}; 
  constructor(
    private modalCtrl: ModalController,
    private navparams: NavParams,
  ) { }

  ngOnInit() {
    this.data = this.navparams.get('obj');
  }

  exit(){
    this.modalCtrl.dismiss();
  }

}
