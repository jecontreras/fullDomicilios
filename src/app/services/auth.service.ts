import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { tap } from 'rxjs/operators';
import {Router, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { PERSONA } from '../interfas/sotarage';

export interface User {
  heroesUrl: string;
  textfile: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  dataUser:any = {};
  constructor(private http: HttpClient, private router: Router, private _store: Store<PERSONA>) {
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
      if (!localStorage.getItem('user')) {
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
      const identity = this.dataUser;
      // console.log(identity)
      if (Object.keys(identity).length >0) {
        return true;
      } else {
        this.router.navigate(['/portada']);
        return false;
      }
    }
}
