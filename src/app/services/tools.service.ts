import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  
  loading:any;

  constructor(
    public toastCtrl: ToastController,
    public loadingCrl: LoadingController,
    private localNotifications: LocalNotifications,
    public alertController: AlertController
  ) { }
 
  async presentToast(mensaje:string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
  
  async presentLoading(mensaje:string = "") {
    this.loading = await this.loadingCrl.create({
      spinner: 'crescent',
      message: 'Iniciando...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await this.loading.present();
  }
  async dismisPresent(){
    if(this.loading) this.loading.dismiss();
    let interval:any = setInterval(()=>{ if(this.loading) { this.loading.dismiss(); clearInterval( interval ); } },2000)
  }

  async presentNotificacion(mensaje:any){
    this.localNotifications.schedule({
      title: mensaje.titulo,
      text: mensaje.text,
      foreground: true
    });
  }

  async presentAlertConfirm( mensaje:any ) {
    return new Promise( async ( resolve )=>{
      const alert = await this.alertController.create({
        header: mensaje.header,
        message: mensaje.mensaje ||'Message <strong>text</strong>!!!',
        buttons: [
          {
            text: mensaje.cancel || 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              resolve(false);
              return false;
            }
          }, {
            text: mensaje.confirm || 'Confirmar',
            handler: () => {
              resolve(true)
              return true;
            }
          }
        ]
      });
  
      await alert.present();
    });
  }

}
