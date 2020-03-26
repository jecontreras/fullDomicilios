import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToolsService } from 'src/app/services/tools.service';
import { PersonaAction } from 'src/app/redux/app.actions';
import { PERSONA } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Indicativo } from 'src/app/JSON/indicativo';

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

  constructor(
    private _user: UserService,
    private _tools: ToolsService,
    private _store: Store<PERSONA>,
    private _router: Router
  ) { 
    
    // if (this._authSrvice.isLoggedIn()) {
    //   this._router.navigate(['/cargando']);
    // }
  }

  ngOnInit() {
  }
  validarDocumento(){
    if(!this.data.celular || !this.data.indicativo) return this._tools.presentToast("Error llenar formulario correcto");
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
          this._tools.presentToast("Error de login");
        }
      },(error)=>{
        this._tools.presentToast("Error de servidor")
        this._tools.dismisPresent();
      });
    }
  }

}
