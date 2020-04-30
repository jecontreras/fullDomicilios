import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToolsService } from 'src/app/services/tools.service';
import { PersonaAction } from 'src/app/redux/app.actions';
import { PERSONA } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Indicativo } from 'src/app/JSON/indicativo';
import { ModalController } from '@ionic/angular';
import { PoliticasPage } from '../politicas/politicas.page';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

const indicativos = Indicativo;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  sliderOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };
  listIndicativos = indicativos;

  data:any = {
    // indicativo: 57
  };
  disablePass:boolean = false;
  user: any = {};
  showUser: boolean = false;

  constructor(
    private _user: UserService,
    private _tools: ToolsService,
    private _store: Store<PERSONA>,
    private _router: Router,
    private modalCtrl: ModalController,
    private facebook: Facebook
  ) { 
    
    // if (this._authSrvice.isLoggedIn()) {
    //   this._router.navigate(['/cargando']);
    // }
  }

  ngOnInit() {
  }

  loginFacebook(){
    this.facebook.login(['public_profile', 'email'])
    .then(rta => {
      console.log(rta.status);
      if(rta.status == 'connected'){
        this.getInfo();
      };
    })
    .catch(error =>{
      console.error( error );
    });
  }

  getInfo(){
    this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
    .then(data=>{
      console.log(data);
      this.showUser = true; 
      this.user = data;
    })
    .catch(error =>{
      console.error( error );
    });
  }

  openView(opt:string){
    console.log(opt);
    if(opt == "facebook") this.loginFacebook();
  }
  
  validarDocumento(){
    if(!this.data.celular || !this.data.indicativo || this.data.celular == "") return this._tools.presentToast("Error llenar formulario correcto");
    this._user.get({where:{celular: this.data.celular, indicativo: this.data.indicativo}}).subscribe((res:any)=>{
      if(res.data[0]){this.disablePass = true;}
      else {this._tools.presentToast("Usuario no encontrado")} 
      this._tools.dismisPresent();
    },error=>{ 
      this._tools.presentToast("Error de documento");
      this._tools.dismisPresent();
    });
  }
  iniciar(){
    if( !this.data.indicativo ) return this._tools.presentToast("Por favor colocar Indicativo de tu pais");
    if( !this.data.celular ) return this._tools.presentToast("Por favor colocar numero celular");
    this._tools.presentLoading();
    if(this.data.celular && !this.data.password)return this.validarDocumento();
    else{
      this._user.login(this.data).subscribe((res:any)=>{
        this._tools.dismisPresent();
        if(res.success){
          let accion:any = new PersonaAction(res.data, 'post');
          this._store.dispatch(accion);
          this._router.navigate(['/cargando']);
        }else{
          this.data.password = "";
          this._tools.presentToast("Error de Password");
        }
      },(error)=>{
        this._tools.presentToast("Error de servidor")
        this._tools.dismisPresent();
      });
    }
  }

  openPoliticas(){
    this.modalCtrl.create({
      component: PoliticasPage,
      componentProps: {}
    }).then(modal=>modal.present());
  }

}
