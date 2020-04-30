import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './redux/app';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SocketIoModule } from 'ngx-socket-io';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MenuPageModule } from './layout/menu/menu.module';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { VercionPageModule } from './dialog/vercion/vercion.module';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    StoreModule.forRoot({ name: appReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    AppRoutingModule,
    HttpClientModule,
    MenuPageModule,
    VercionPageModule,
    SocketIoModule.forRoot( environment.socketConfig ),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    Geolocation,
    StatusBar,
    LocalNotifications,
    SplashScreen, 
    ImagePicker,
    FileTransfer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Facebook
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
