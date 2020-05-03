import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { Router } from '@angular/router';
import { PERSONA } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { PersonaAction } from 'src/app/redux/app.actions';

@Component({
  selector: 'app-cargando',
  templateUrl: './cargando.page.html',
  styleUrls: ['./cargando.page.scss'],
})
export class CargandoPage implements OnInit {

  sliderOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };
  data:any = {};
  rolUser:string;

  constructor(
    private _tools: ToolsService,
    private _router: Router,
    private _store: Store<PERSONA>,
  ) {
    this._store.subscribe((store:any)=>{
      store = store.name;
      this.data = store.persona || {};
      if(this.data['rol']){
        this.rolUser = ( this.data['rol'].rol );
      }
    });
  }
  
  ngOnInit() {
    if(Object.keys(this.data).length === 0) { this._router.navigate(['/portada']); return false;}
     this._tools.presentLoading();
    setTimeout(()=>{ 
      this._tools.dismisPresent();
      if(!this.rolUser) return this.clearLogin();
      if(this.rolUser == 'usuario') this._router.navigate(['/usuarios/home']);
      if(this.rolUser == 'conductor') this._router.navigate(['/conductor/home']);
    }, 3000);
  }

  clearLogin(){
    this._tools.presentToast("Error de Login");
    let accion = new PersonaAction({},'drop');
    this._store.dispatch(accion);
    this._router.navigate(['/portada']);
    //location.reload();
  }

}
