import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToolsService } from 'src/app/services/tools.service';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.page.html',
  styleUrls: ['./politicas.page.scss'],
})
export class PoliticasPage implements OnInit {

  dataUser:any = {};
  data:any = {};

  constructor(
    private modalCtrl: ModalController,
    private _tools: ToolsService,
    private _store: Store<STORAGES>
  ) { 
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona;
      this.data = store.APP || {};
    });
  }

  ngOnInit() {
  }

  exit(){
    this.modalCtrl.dismiss();
  }

}
