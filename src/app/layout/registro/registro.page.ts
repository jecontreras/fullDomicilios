import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToolsService } from 'src/app/services/tools.service';
import { PERSONA } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { PersonaAction } from 'src/app/redux/app.actions';
import { Router } from '@angular/router';
import { Indicativo } from 'src/app/JSON/indicativo';
import { ModalController } from '@ionic/angular';
import { PoliticasPage } from '../politicas/politicas.page';

const indicativos = Indicativo;

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  listIndicativos = indicativos;

  sliderOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  data:any = {
    rol: "usuario"
  };
  disablePass:boolean = false;

  btnDisabled:boolean = false;

  constructor(
    private _user: UserService,
    private _tools: ToolsService,
    private _store: Store<PERSONA>,
    private _router: Router,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  iniciar(){
    this.btnDisabled = true;
    this._user.register(this.data).subscribe((res)=>{
      this.btnDisabled = false;
      if(res.status == 200){
        let accion:any = new PersonaAction(res.data, 'post');
        this._store.dispatch(accion);
        this._router.navigate(['/cargando']);
      }else{
        this._tools.presentToast(res.data);
      }
      this.btnDisabled = false;
    }, error=>{ this._tools.presentToast("Error de Servidor") });
  }

  openPoliticas(){
    this.modalCtrl.create({
      component: PoliticasPage,
      componentProps: {}
    }).then(modal=>modal.present());
  }

}
