import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/cargando/cargando.module').then( m => m.CargandoPageModule)
  },
  {
    path: 'portada',
    loadChildren: () => import('./layout/portada/portada.module').then( m => m.PortadaPageModule)
  },
  {
    path: 'cargando',
    loadChildren: () => import('./pages/cargando/cargando.module').then( m => m.CargandoPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./layout/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'platos',
    loadChildren: () => import('./pages/platos/platos.module').then( m => m.PlatosPageModule)
  },
  {
    path: 'platos/:id',
    loadChildren: () => import('./pages/platos/platos.module').then( m => m.PlatosPageModule)
  },
  {
    path: 'view-restaurante/:id',
    loadChildren: () => import('./pages/view-restaurante/view-restaurante.module').then( m => m.ViewRestaurantePageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
