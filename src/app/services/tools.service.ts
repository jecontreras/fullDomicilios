import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  
  loading:any;

  constructor(
    public toastCtrl: ToastController,
    public loadingCrl: LoadingController,
    private localNotifications: LocalNotifications,
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
      message: mensaje || 'Please wait...',
      duration: 2000
    });
    await this.loading.present();
  }
  async dismisPresent(){
    if(this.loading) await this.loading.dismiss();;
  }

  async presentNotificacion(mensaje:any){
    this.localNotifications.schedule({
      title: mensaje.titulo,
      text: mensaje.text,
      foreground: true
    });
  }

}
