import { Component, OnInit, ViewChildren } from '@angular/core';
import { PERSONA } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/services/user.service';
import { ToolsService } from 'src/app/services/tools.service';
import { PersonaAction } from 'src/app/redux/app.actions';
import { ArchivoService } from 'src/app/service-component/archivo.services';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  data:any = {};
  fotoPerfil:string;
  options:any;
  imageResponse:any = [];
  imagenView:any = [];

  constructor(
    private _store: Store<PERSONA>,
    private _user: UserService,
    private imagePicker: ImagePicker,
    private _tools: ToolsService,
    private _archivo: ArchivoService
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

  getImages() {
    this.options = {
      maximumImagesCount: 6,
      width: 300,
      height: 600,
      quality: 100,
      outputType: 1
    };
    this.imageResponse = [];
    this.imagenView = [];
    this.imagePicker.getPictures(this.options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
        this.imagenView.push({
          id: i,
          foto: 'data:image/jpeg;base64,' + results[i]
        });
      }
    }, (err) => {
      alert(err);
    });
  }

  async openGaleria(){
    // let result:any = await this._archivo.getImages();
    // console.log( result );
    // this.fotoPerfil = result[0].foto;
    this.getImages();
  }

  uploadImage(){
    // this.data.opt_archivo = 'articulo';
    // this._archivo.upload( this.data ).then((res)=>{
    //   console.log( res);
    // });
    this.data.opt_archivo = 'articulo';
    this._archivo.upload(this.imageResponse, this.data ).then(()=>{
      if(this.imageResponse.length >0)alert("Exitoso");
    });
  }
  

}
