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
    path: 'login',
    loadChildren: () => import('./layout/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./layout/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'ayuda',
    loadChildren: () => import('./pages/ayuda/ayuda.module').then( m => m.AyudaPageModule)
  },
  {
    path: 'cargando',
    loadChildren: () => import('./pages/cargando/cargando.module').then( m => m.CargandoPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuarios/usuarios.module').then( m => m.UsuariosModule)
  },
  {
    path: 'conductor',
    loadChildren: () => import('./pages/conductor/conductor.module').then( m => m.ConductorModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./pages/notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
  },
  {
    path: 'politicas',
    loadChildren: () => import('./layout/politicas/politicas.module').then( m => m.PoliticasPageModule)
  },
  {
    path: 'solicitar',
    loadChildren: () => import('./dialog/solicitar/solicitar.module').then( m => m.SolicitarPageModule)
  },
  {
    path: 'chat-detallado',
    loadChildren: () => import('./dialog/chat-detallado/chat-detallado.module').then( m => m.ChatDetalladoPageModule)
  },
  {
    path: 'confirmar',
    loadChildren: () => import('./dialog/confirmar/confirmar.module').then( m => m.ConfirmarPageModule)
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
