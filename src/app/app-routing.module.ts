import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';

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
    path: '',
    component: AdminComponent,
    children: [
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
      {
        path: 'chat',
        loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
      },
      {
        path: 'buscar',
        loadChildren: () => import('./pages/buscar/buscar.module').then( m => m.BuscarPageModule)
      },
      {
        path: 'pedidos',
        loadChildren: () => import('./pages/pedidos/pedidos.module').then( m => m.PedidosPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'favoritos',
        loadChildren: () => import('./pages/favoritos/favoritos.module').then( m => m.FavoritosPageModule)
      },
      {
        path: 'cupones',
        loadChildren: () => import('./pages/cupones/cupones.module').then( m => m.CuponesPageModule)
      },
      {
        path: 'formapago',
        loadChildren: () => import('./pages/forma-pago/forma-pago.module').then( m => m.FormaPagoPageModule)
      },
      {
        path: 'avisos',
        loadChildren: () => import('./pages/avisos/avisos.module').then( m => m.AvisosPageModule)
      },
      {
        path: 'configuracion',
        loadChildren: () => import('./pages/configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
      },
      {
        path: 'sugerirrestaurante',
        loadChildren: () => import('./pages/sugerir-restaurante/sugerir-restaurante.module').then( m => m.SugerirRestaurantePageModule)
      },
      {
        path: 'ayuda',
        loadChildren: () => import('./pages/ayuda/ayuda.module').then( m => m.AyudaPageModule)
      },
      {
        path: 'unetenosotros',
        loadChildren: () => import('./pages/unete-nosotros/unete-nosotros.module').then( m => m.UneteNosotrosPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
