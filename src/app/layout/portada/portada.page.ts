import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portada',
  templateUrl: './portada.page.html',
  styleUrls: ['./portada.page.scss'],
})
export class PortadaPage implements OnInit {
  
  sliderOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  lat:number;
  lon:number;

  constructor(
    private _authSrvice: AuthService,
    private _router: Router,
    private geolocation: Geolocation,
  ) {
    if (this._authSrvice.isLoggedIn()) {
      this._router.navigate(['/cargando']);
    }
   }

  ngOnInit() {
    //location.reload();
  }

  permitirGps(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
      this._router.navigate(['/login']);
    }); 
  }

}
