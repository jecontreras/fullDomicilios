import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { tap } from 'rxjs/operators';
import {Router, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { PERSONA } from '../interfas/sotarage';
import { Facebook } from '@ionic-native/facebook/ngx';
import { UserService } from './user.service';
import { ToolsService } from './tools.service';
import { PersonaAction } from '../redux/app.actions';

export interface User {
  heroesUrl: string;
  textfile: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
 
  dataUser:any = {};
  btnDisabled:boolean = false;
  showUser:boolean = false;
  user:any = {};
  banderaFacebook:boolean

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private _store: Store<PERSONA>,
    private facebook: Facebook,
    private _user: UserService,
    private _tools: ToolsService
  ) {
      this._store
      .subscribe((store:any)=>{
        store = store.name;
        this.dataUser = store.persona || {};
      });
    }

   private setSession(authResult) {
        const expiresAt = moment().add(authResult.expiresIn, 'second');

        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );
    }

    logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
    }

    public isLogged() {
        if (!localStorage.getItem('user')) {
          this.router.navigate(['/portada']);
        } else {
          return false;
        }
    }

    public isLoggedIn() {
      if (Object.keys(this.dataUser).length == 0) {
        return false;
      } else {
        return true;
      }
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

    canActivate() {
      const identity = this.dataUser || {};
      // console.log(identity)
      if (Object.keys(identity).length >0) {
        console.log( identity.facebookActualizar && identity.idFacebook !== ""   )
        if( identity.facebookActualizar && identity.idFacebook !== "" ) this.loginFacebook();
        return true;
      } else {
        this.router.navigate(['/portada']);
        return false;
      }
    }

    loginFacebook(){
      this.btnDisabled = true;
      this.facebook.login(['public_profile', 'email'])
      .then(rta => {
        // console.log(rta.status);
        if(rta.status == 'connected') this.getInfo();
      })
      .catch(error =>console.error( error ));
    }
  
    getInfo(){
      this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
      .then(data=>{
        // console.log(data);
        this.showUser = true; 
        this.user = data;
        this.getUserData();
      })
      .catch(error =>console.error( error ));
    }
  
    getUserData(){
      this._user.get({ where: { idFacebook: this.user.id }}).subscribe((res:any)=>{
        res = res.data[0];
        if(!res) return false;
        else this.updateUser( res );
      },(error)=> { this._tools.presentToast("Error de conexion"); })
    }
  
    updateUser( res:any ){
      let data:any = {
        email: this.user.email,
        nombre: this.user.name,
        foto: this.user.picture.data.url,
        facebookActualizar: false,
        id: res.id
      };
      this._user.update(data).subscribe((res:any)=>this.ProcesoStorages( { data: res } ));
    }

    ProcesoStorages( res:any ){
      this.btnDisabled = false;
      let accion:any = new PersonaAction(res.data, 'post');
      this._store.dispatch(accion);
    }
}
