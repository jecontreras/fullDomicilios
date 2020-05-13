import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataService } from './services/data.service';
import { WebsocketService } from './services/websocket.services';
import { VersionService } from './service-component/version.service';
import { UserService } from './services/user.service';
import { PERSONA } from './interfas/sotarage';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { PersonaAction } from './redux/app.actions';
import { ToolsService } from './services/tools.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public data:any={};

  dataMenu:any = [];
  dataUser:any = {};

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    //private dataService: DataService,
    private wsService: WebsocketService,
    private _app: VersionService,
    private _user: UserService,
    private _store: Store<PERSONA>,
    private router: Router,
    private _tools: ToolsService
  ) {
    this.initializeApp();
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona || {};
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if(Object.keys(this.dataUser).length > 0 ) { this.getValidarUser(); this.contadorValidar();}
      //this.dataService.getMenuOpts().subscribe(rta=>{this.dataMenu=rta; console.log(rta) });
    });
  }
  getValidarUser(){
    this._user.get( { where: { id: this.dataUser.id, estado: 0 } } ).subscribe((res:any)=>{
      res = res.data[0];
      if(res) return true;
      this.cerrar_seccion();
    });
  }

  contadorValidar(){
    setInterval(()=>{
      this.getValidarUser();
    },7200000);
  }

  cerrar_seccion(){
    let accion = new PersonaAction({}, 'delete');
    this._store.dispatch(accion);
    localStorage.removeItem('user');
    localStorage.removeItem('APP');
    this._tools.presentToast("Cuenta inactiva por favor hablar con el admin");
    setTimeout(()=>{
      location.reload();
      this.router.navigate(['/portada']);
    },2000)
  }

}
