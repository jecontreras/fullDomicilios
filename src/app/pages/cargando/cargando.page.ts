import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/services/tools.service';
import { Router } from '@angular/router';

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

  constructor(
    private _tools: ToolsService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._tools.presentLoading();
    setTimeout(()=>{ 
      this._router.navigate(['/home']);
      this._tools.dismisPresent();
    }, 3000);
  }

}
