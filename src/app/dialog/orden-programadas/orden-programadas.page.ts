import { Component, OnInit } from '@angular/core';
import { OfertandoService } from 'src/app/service-component/ofertando.service';
import { NavParams, ModalController } from '@ionic/angular';
import { OrdenProgramadosService } from 'src/app/service-component/orden-programados.service';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import { WebsocketService } from 'src/app/services/websocket.services';

@Component({
  selector: 'app-orden-programadas',
  templateUrl: './orden-programadas.page.html',
  styleUrls: ['./orden-programadas.page.scss'],
})
export class OrdenProgramadasPage implements OnInit {
  data:any = {};
  listRow:any = [];
  query:any = {
    where:{
      estado: 0,
      ordenProgramada: 0
    },
    skip: 0
  };
  disableBtnEditar:boolean = false;
  disableBtnPactada:boolean = false;
  
  constructor(
    private _ofertando: OfertandoService,
    private navparams: NavParams,
    private _ordenProgramada: OrdenProgramadosService,
    private _tools: ToolsService,
    private modalCtrl: ModalController,
    private wsServices: WebsocketService
  ) { }

  ngOnInit() {
    this.data = this.navparams.get('obj');
    this.query.where.ordenProgramada = this.data.id;
    this.getOfertando();
  }

  getOfertando(){
    this._ofertando.get(this.query).subscribe((res:any)=>this.listRow = res.data);
  }

  editarOrden(){
    this.disableBtnEditar = true;
    this.data = _.omit(this.data, ['usuario', 'createdAt', 'updatedAt']);
    this._ordenProgramada.editar(this.data).subscribe((res:any)=>{
      this.disableBtnEditar = false;
      this._tools.presentToast("Actualizado correctamente");
      this.wsServices.emit( 'orden-programada-editada', res);
    },(error)=> {this.disableBtnEditar = false; this._tools.presentToast("Error al actualizar el item")});
  }

  aceptoConductor( item:any ){
    let data:any = {
      id: this.data.id,
      conductor: item.usuario.id,
      costoConductor: item.ofrece,
      costoPactado: item.ofrece,
      idOfertando: item.id,
      estado: 3
    };
    this.disableBtnPactada = true;
    this._ordenProgramada.editar(data).subscribe((res:any)=>{
      this.wsServices.emit( 'orden-programada-aceptada', res );
      this.disableBtnPactada = false;
      this._tools.presentToast("Aceptaste al conductor");
    },(error:any)=> this.disableBtnPactada = true );
  }

  exit(){
    this.modalCtrl.dismiss();
  }

}
