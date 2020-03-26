import { Component, OnInit, ɵConsole } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MenuController } from '@ionic/angular';
import { PERSONA } from 'src/app/interfas/sotarage';
import { Store } from '@ngrx/store';
import { PersonaAction } from 'src/app/redux/app.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  dataMenu:any = [];
  data:any = {};

  constructor(
    private dataService: DataService,
    private menu: MenuController,
    private _store: Store<PERSONA>,
    private router: Router
  ) { 

    this._store
    .subscribe((store:any)=>{
      store = store.name;
      console.log(store);
      this.data = store.persona || {};
    });
  }

  ngOnInit() {
    this.dataService.getMenuOpts().subscribe(rta=>{this.dataMenu=rta; console.log(rta) });
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
}
