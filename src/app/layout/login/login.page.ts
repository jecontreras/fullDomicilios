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
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

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

  vista:string = "home";

  btnDisabled:boolean = false;

  constructor(
    private _user: UserService,
    private _tools: ToolsService,
    private _store: Store<PERSONA>,
    private _router: Router,
    private modalCtrl: ModalController,
    private facebook: Facebook,
    private _authSrvice: AuthService,
    private iab: InAppBrowser
  ) { 
    
    // if (this._authSrvice.isLoggedIn()) {
    //   this._router.navigate(['/cargando']);
    // }
  }

  ngOnInit() {
  }

  openView(opt:string){
    if(opt == "facebook") this.loginFacebook();
    if(opt == "google") this.loginGoogle();
    this.vista = opt;
  }

  loginFacebook(){
    this.facebook.login(['public_profile', 'email'])
    .then(rta => {
      if(rta.status == 'connected'){
        this.getInfo();
      };
    })
    .catch(error =>{
      console.error( error );
      this.vista = "home";
    });
  }

  loginGoogle(){
    this.btnDisabled = true;
    this._user.get({
      where:{
        nombre: "jose"
      },limit: 1
    }).subscribe((res:any)=> this.ProcesoStorages( { data: res.data[0]} ),(error:any)=> this.btnDisabled = false);
  }

  getInfo(){
    this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
    .then(data=>{
      this.showUser = true; 
      this.user = data;
      this.getUserData();
    })
    .catch(error =>{
      console.error( error );
      this.vista = "home";
    });
  }

  getUserData(){
    this._user.get({ where: { idFacebook: this.user.id }}).subscribe((res:any)=>{
      res = res.data[0];
      if(!res) return this.procesoCrearUser();
      else this.updateUser( res );
      this.ProcesoStorages( { data: res } );
    },(error)=> { this._tools.presentToast("Error de conexion"); })
  }

  updateUser( res:any ){
    let data:any = {
      email: this.user.email,
      nombre: this.user.name,
      foto: this.user.picture.data.url,
      id: res.id,
      facebookActualizar: false
    };
    this._user.update(data).subscribe((res:any)=>console.log(res));
  }

  procesoCrearUser(){
    let data:any = {
      rol: "usuario",
      email: this.user.email,
      password: 98090871986,
      confirpassword: 98090871986,
      nombre: this.user.name,
      foto: this.user.picture.data.url,
      idFacebook: this.user.id
    };
    this._user.register(data).subscribe((res:any)=>{
      console.log(res);
      if(res.status == 200) this.ProcesoStorages( res ); 
      else this._tools.presentToast(res.data);
    },(error)=>this._tools.presentToast("Lo sentimos intente mas tarde"));
  }

  ProcesoStorages( res:any ){
    let accion:any = new PersonaAction(res.data, 'post');
    this._store.dispatch(accion);
    this._router.navigate(['/cargando']);
  }

  iniciar(){
    //this._tools.presentLoading();
    this.btnDisabled = true;
    this._user.login(this.data).subscribe((res:any)=>{
      //this._tools.dismisPresent();
      this.btnDisabled = false;
      if(res.success){
        this.ProcesoStorages( res );
      }else{
        this.data.password = "";
        this._tools.presentToast("Error de Password");
      }
    },(error)=>{
      this._tools.presentToast("Error de servidor")
      this.btnDisabled = false;
    });
  }

  openPoliticas(){
    this.modalCtrl.create({
      component: PoliticasPage,
      componentProps: {}
    }).then(modal=>modal.present());
  }

  openRecuperar( url:string ){
    const browser = this.iab.create(url, '_system');
  }

  pruebas( opt: string ){
    let user:string = "";
    if( opt == 'usuario') user = "jose@email.com";
    else user = "manolas@email.com";
    this.btnDisabled = true;
    this._user.get( { where: { email: user } } ).subscribe((res:any)=>{
      res = res.data[0];
      if( !res ) return this._tools.presentToast("Error estamos teniendo problemas con el servidor");
      else this.ProcesoStorages( { data: res } );
      this.btnDisabled = false;
    })
  }

}
