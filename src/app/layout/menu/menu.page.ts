import { Component, OnInit, ɵConsole } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MenuController } from '@ionic/angular';
import { PERSONA } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { PersonaAction } from 'src/app/redux/app.actions';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  dataMenu:any = [];
  data:any = {};
  rolUser:string;
  disableBtn:boolean = false;
  constructor(
    private dataService: DataService,
    private menu: MenuController,
    private _store: Store<PERSONA>,
    private router: Router,
    private _user: UserService,
    private _tools: ToolsService
  ) { 

    this._store
    .subscribe((store:any)=>{
      store = store.name;
      this.data = store.persona || {};
      if(this.data['rol']){
        if(this.data['rol'].rol != this.rolUser){
          this.cargaMenu();
        }
        this.rolUser = ( this.data['rol'].rol );
      }
    });
  }

  ngOnInit() {
    // this.cargaMenu();
  }
  cargaMenu(){
    this.dataService.getMenuOpts().subscribe(rta=>{ 
      this.dataMenu=rta.map((row:any)=>{
        if(row.opt){
          if(this.rolUser === 'usuario'){
            row.redirectTo = `/usuarios${ row.redirectTo }`;
          }else{
            row.redirectTo = `/conductor${ row.redirectTo }`;
          }
        }
        return row;
      }); 
    });
  }
  openEnd() {
    this.menu.close();
  }
  cerrar_seccion(){
    let accion = new PersonaAction({}, 'delete');
    this._store.dispatch(accion);
    localStorage.removeItem('user');
    this.router.navigate(['/portada']);
  }
  cambioRol(opt:string){
    this.disableBtn = true;
    this._user.updateRol({ id: this.data.id, rol: opt}).subscribe((res:any)=>{
      this.data = res.data;
      let accion = new PersonaAction(this.data, 'post');
      this._store.dispatch(accion);
      this._tools.presentToast("Actualizado el cambio de tipo de cuenta");
      this.disableBtn = false;
      setTimeout(()=>{ 
        if(opt == 'conductor'){
          this.router.navigate(['/conductor']);
        }else{
          this.router.navigate(['/usuarios']);
        }
        //location.reload();
      }, 3000);
    },(error)=> { console.error(error); this._tools.presentToast("Error al cambiar de tipo de cuenta"); this.disableBtn = false;})
  }
}
