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
  bandera:boolean = false;

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
   ionViewWillEnter(){
     console.log(1, this.bandera)
     if(this.bandera){
      this.validandoLogin();
      this.InitApp();
     }
   }
  //  ionViewDidEnter(){
  //    console.log(2)
  //  }
  //  ionViewWillLeave(){
  //    console.log(3)
  //  }
  // ionViewDidLeave(){
  //   console.log(4)
  // }
  //  ngOnDestroy(){
  //    console.log(5)
  //  }
  ngOnInit() {
     this.validandoLogin();
     this._tools.presentLoading();
    setTimeout(()=>{ 
      this.InitApp();
    }, 3000);
  }

  validandoLogin(){
    if(Object.keys(this.data).length === 0) { this._router.navigate(['/portada']); return false;}
  }

  InitApp(){
    this._tools.dismisPresent();
    this.bandera = true;
    if(!this.rolUser) return this.clearLogin();
    if(this.rolUser == 'usuario') this._router.navigate(['/usuarios/home']);
    if(this.rolUser == 'conductor') this._router.navigate(['/conductor/home']);
  }

  clearLogin(){
    this._tools.presentToast("Error de Login");
    let accion = new PersonaAction({},'drop');
    this._store.dispatch(accion);
    this._router.navigate(['/portada']);
    //location.reload();
  }

}
