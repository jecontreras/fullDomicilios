import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'viajes',
        loadChildren: () => import('./viajes/viajes.module').then( m => m.ViajesPageModule)
      },
      {
        path: 'interurbano',
        loadChildren: () => import('./interurbano/interurbano.module').then( m => m.InterurbanoPageModule)
      },
      {
        path: 'carga',
        loadChildren: () => import('./carga/carga.module').then( m => m.CargaPageModule)
      }
    ]
  },  {
    path: 'mapa',
    loadChildren: () => import('./mapa/mapa.module').then( m => m.MapaPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConductorRoutingModule { }
