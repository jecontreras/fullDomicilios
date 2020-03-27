import { Component, OnInit } from '@angular/core';
import { PERSONA } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/services/user.service';
import { ToolsService } from 'src/app/services/tools.service';
import { PersonaAction } from 'src/app/redux/app.actions';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  data:any = {};
  constructor(
    private _store: Store<PERSONA>,
    private _user: UserService,
    private _tools: ToolsService
  ) { 
    this._store
      .subscribe((store:any)=>{
        store = store.name;
        this.data = store.persona;
      });
  }

  ngOnInit() {
  }

  submit(){
    let data:any = {
      id: this.data.id,
      nombre: this.data.nombre,
      apellido: this.data.apellido,
      fechaNacimiento: this.data.fechaNacimiento,
      sexo: this.data.sexo,
      email: this.data.email,
      ciudad: this.data.ciudad
    };
    if(!data.id) return this._tools.presentLoading("Informacion no valida");
    this._tools.presentLoading();
    this._user.update(data).subscribe((res:any)=>{
      console.log(res);
      this._tools.presentToast("Actualizada la informacion");
      this._tools.dismisPresent();
      let accion = new PersonaAction(res, 'post');
      this._store.dispatch(accion);
    },(error:any)=>{ console.error(error); this._tools.presentToast("Error al actualizar"); this._tools.dismisPresent(); });
  }

}
