import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { DEPARTAMENTO } from 'src/app/JSON/departamento';

@Component({
  selector: 'app-unete-nosotros',
  templateUrl: './unete-nosotros.page.html',
  styleUrls: ['./unete-nosotros.page.scss'],
})
export class UneteNosotrosPage implements OnInit {
  
  data:any = [];
  listTipoCocina:any = [];
  listDepartamento:any = DEPARTAMENTO;
  listCiudad:any = [];

  constructor(
    private _DataServe: DataService
  ) { }

  ngOnInit() {
    this.listTipoCocina = this._DataServe.dbs.listTipoCocina;
  }

  blurdepartamento(){
    console.log("triple hp");
    let filtro:any = this.listDepartamento.find( ( row:any )=> row.departamento == this.data.departamento );
    if( !filtro ) return false;
    this.listCiudad = filtro.ciudades;
  }

  guardar(){

  }

}
