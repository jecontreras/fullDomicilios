import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { PaqueteService } from 'src/app/service-component/paquete.service';
import { ToolsService } from 'src/app/services/tools.service';
import { environment } from 'src/environments/environment';
import { STORAGES } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
declare var ePayco: any;

const URL = environment.url;
const URLFRONT = environment.urlFront;

@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.page.html',
  styleUrls: ['./paquetes.page.scss'],
})
export class PaquetesPage implements OnInit {

  listPaquetes:any = [];
  dataUser:any = {};
  disableBtn:boolean = false;

  constructor(
    private _paquete: PaqueteService,
    private modalCtrl: ModalController,
    private _tools: ToolsService,
    private _store: Store<STORAGES>
  ) {

    this._store.subscribe((store:any)=>{
      store = store.name;
      this.dataUser = store.persona;
      console.log(this.dataUser)
    });

   }

  ngOnInit() {
    this.getPaquetes();
  }

  getPaquetes(){
    this._paquete.get( { where: { estado: 0 }}).subscribe((res:any)=>{
      this.listPaquetes = res.data;
    },(error)=> this._tools.presentToast("Error de Servidor"));
  }
  
  OpenEpayco( obj:any ){
    if( this.disableBtn ) return false;
    if( !obj.paquete ) return this._tools.presentToast("Error de formulario Por Favor serrar la app")
    this.disableBtn = true;
    this._tools.presentLoading();
    const handler:any = ePayco.checkout.configure({
      key: '90506d3b72d22b822f53b54dcf22dc3a',
      test: true
    });
    let data:any ={
      //Parametros compra (obligatorio)
      name: obj.paquete,
      description: obj.descripcion,
      invoice: this.codigo(),
      currency: "cop",
      amount: obj.costoPaquete,
      tax_base: "0",
      tax: "0",
      country: "co",
      lang: "eng",
      //Onpage="false" - Standard="true"
      external: "true", 
      //Atributos opcionales
      extra1: "extra1",
      extra2: "extra2",
      extra3: "extra3",
      confirmation: URL+"/paquete/comprado",
      //confirmation: "https://f37798ba.ngrok.io/paquete/comprado",
      response: URLFRONT,

      //Atributos cliente
      name_billing: this.dataUser.nombre || '',
      address_billing: this.dataUser.email || '',
      type_doc_billing: "cc" || '',
      mobilephone_billing: this.dataUser.celular || '',
      number_doc_billing: this.dataUser.cedula || ''
    }
    this.createPago( data.invoice );
    handler.open(data)
    setTimeout(()=>{
      this.disableBtn = false;
      this._tools.dismisPresent();
    }, 5000)
  }

  createPago( id:string ){
    let data:any = {
      usuario: this.dataUser.id,
      x_id_factura: id
    };
    this._paquete.createPago( data ).subscribe(( res:any )=>console.log( res ));
  }

  exit(){
    this.modalCtrl.dismiss(
      {'dismissed': true}
    );
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }

}
