import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay } from 'rxjs/operators';
import { Componente } from '../interfas/interfaces';
import { ServiciosService } from './servicios.service';
import { ToolsService } from './tools.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  dbs: any = {};

  constructor(
    private http: HttpClient,
    private _servicio: ServiciosService,
    private _tools: ToolsService
    ) {
    let listCocinas:any = [
      {
        foto:"https://cdn.viajala.com/img/blog/hornado.jpg?zIvKREsIOfDEQLzbBC3t4DnDzqUH4GVK",
        id: 1,
        descripcion: "Tipica"
      },
      {
        foto:"https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg",
        id: 2,
        descripcion: "Parrilla"
      },
      {
        foto:"https://gastronomiaycia.republica.com/wp-content/uploads/2011/08/hct_polloasadoconcha.jpg",
        id: 3,
        descripcion: "Pollo"
      }
    ];
    let listRestaurante:any = [
      {
        foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
        titulo: "Donde la Negra Costeña",
        id: 1,
        rango: "* 4,8 . Tipica . 7,7km",
        detalles: "45-55 min . $ 5.000"
      },
      {
        foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
        titulo: "Donde la Negra Costeña",
        id: 2,
        rango: "* 4,8 . Tipica . 7,7km",
        detalles: "45-55 min . $ 5.000"
      },
      {
        foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
        titulo: "Donde la Negra Costeña",
        id: 3,
        rango: "* 4,8 . Tipica . 7,7km",
        detalles: "45-55 min . $ 5.000"
      },
      {
        foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
        titulo: "Donde la Negra Costeña",
        id: 4,
        rango: "* 4,8 . Tipica . 7,7km",
        detalles: "45-55 min . $ 5.000"
      },
      {
        foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
        titulo: "Donde la Negra Costeña",
        id: 5,
        rango: "* 4,8 . Tipica . 7,7km",
        detalles: "45-55 min . $ 5.000"
      },
      {
        foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
        titulo: "Donde la Negra Costeña",
        id: 6,
        rango: "* 4,8 . Tipica . 7,7km",
        detalles: "45-55 min . $ 5.000"
      },
      {
        foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
        titulo: "Donde la Negra Costeña",
        id: 7,
        rango: "* 4,8 . Tipica . 7,7km",
        detalles: "45-55 min . $ 5.000"
      }
    ];
    let listMenu:any = [
      {
        titulo: "Inicio",
        icon: "home-outline"
      },
      {
        titulo: "Buscar",
        icon: "search-outline"
      },
      {
        titulo: "Pedidos",
        icon: "clipboard-outline"
      },
      {
        titulo: "Perfil",
        icon: "person-outline"
      }
    ];
    let listArticulos:any = [
      {
        titulo: "Pastel Ranchero",
        descripcion: "Salchicha ranchera de zenú con jamón y queso mozarella",
        precio: "6700",
        id: 1,
        precioPromo: "8000",
        valorDomicilio: "7000",
        restaurante: {},
        tiempo: "60-70 min",
        foto: "https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg"
      },
      {
        titulo: "Pastel Ranchero",
        descripcion: "Salchicha ranchera de zenú con jamón y queso mozarella",
        precio: "6700",
        id: 2,
        precioPromo: "8000",
        valorDomicilio: "7000",
        restaurante: {},
        tiempo: "60-70 min",
        foto: "https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg"
      },
      {
        titulo: "Pastel Ranchero",
        descripcion: "Salchicha ranchera de zenú con jamón y queso mozarella",
        precio: "6700",
        id: 3,
        precioPromo: "8000",
        valorDomicilio: "7000",
        restaurante: {},
        tiempo: "60-70 min",
        foto: "https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg"
      }
    ];
    let listCartas:any = [
      {
        foto:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQEXOdnWrzZgtxWzIZyMRMYmJUBZXvKY9egTQ&usqp=CAU",
        descripcion: "¡Pide de 11:00 am a 3:00 pm y disfruta!"
      },
      {
        foto:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ9IC-ciQRfqJf5JJ3MoGAWF9xqdcD7llRGCg&usqp=CAU",
        descripcion: "Descubre algo nuevo"
      }
    ];
    let listOpcion:any = [
      {
        titulo: "Ordenar por Precio",
        icon: "search-outline"
      },
      {
        titulo: "Domicilios gratis",
        icon: "clipboard-outline"
      },
      {
        titulo: "Rastreable",
        icon: "person-outline"
      },
      {
        titulo: "Tipo Pago",
        icon: "person-outline"
      },
    ];
    let listHistorial:any = [
      {
        titulo: "Pollo"
      },
      {
        titulo: "Pizza"
      },
      {
        titulo: "Tipica"
      },
    ]
    let tabsBuscador:any = ["Restaurante","Platillos"];
    let listPedidos:any = [
      {
        titulo: "Cerdo y pollo",
        descripcion: "1x Costilla de Cerdo Ahumado",
        createdAt: new Date(),
        calificacion: 5,
        listArticulos: listArticulos,
        subtotalForm: "$ 12.000",
        costoDomicilioForm: "$ 4.000",
        totalForm: "$ 16.000",
        direccion: "Cl 23 # 14 - 70 entregar en las manos - casa brisa del molino - Cucuta - NORTE DE SANTANDER",
        numeroPedido: "001",
        cambioDe: "$ 20.000",
        empresa: {
          titulo: "Cerdo y Pollito"
        }
      },
      {
        titulo: "Cerdo y pollo",
        descripcion: "1x Costilla de Cerdo Ahumado",
        createdAt: new Date(),
        calificacion: 5,
        listArticulos: listArticulos,
        subtotalForm: "$ 12.000",
        costoDomicilioForm: "$ 4.000",
        totalForm: "$ 16.000",
        direccion: "Cl 23 # 14 - 70 entregar en las manos - casa brisa del molino - Cucuta - NORTE DE SANTANDER",
        numeroPedido: "001",
        cambioDe: "$ 20.000",
        empresa: {
          titulo: "Cerdo y Pollito"
        }
      },
      {
        titulo: "Cerdo y pollo",
        descripcion: "1x Costilla de Cerdo Ahumado",
        createdAt: new Date(),
        calificacion: 5,
        listArticulos: listArticulos,
        subtotalForm: "$ 12.000",
        costoDomicilioForm: "$ 4.000",
        totalForm: "$ 16.000",
        direccion: "Cl 23 # 14 - 70 entregar en las manos - casa brisa del molino - Cucuta - NORTE DE SANTANDER",
        numeroPedido: "001",
        cambioDe: "$ 20.000",
        empresa: {
          titulo: "Cerdo y Pollito"
        }
      },
    ];
    let listFavoritos:any = listRestaurante;
    let listMenus:any = [
      {
        icons: "chatbubble-ellipses-outline",
        titulo: "Chats",
        url: "/chat"
      },
      {
        icons: "heart-outline",
        titulo: "Favoritos",
        url: "/favoritos"
      },
      {
        icons: "laptop-outline",
        titulo: "Cupones",
        url: "/cupones"
      },
      {
        icons: "card-outline",
        titulo: "Forma de pago",
        url: "/formapago"
      },
      {
        icons: "notifications-outline",
        titulo: "Avisos",
        url: "/avisos"
      },
      {
        icons: "settings-outline",
        titulo: "Configuraciones",
        url: "/configuracion"
      },
      {
        icons: "fast-food-outline",
        titulo: "Sugerir restarurante",
        url: "/sugerirrestaurante"
      },
      {
        icons: "medkit-outline",
        titulo: "Ayuda",
        //url: "/ayuda"
      },
      {
        icons: "planet-outline",
        titulo: "Únete con nosotros",
        url: "/unetenosotros"
      },
    ];
    let listCupones:any = [
      {
        titulo: "Tienes $5.000",
        subtitulo: "Asi pides #ComoTeGusta",
        expira: new Date(),
        expirtaDes: "La validez ha expirado",
        estado: "finalizado",
        valorCupon: "$4.900",
        valorPedido: "$9.900",
        usoRestaurant: "limitados",
        cupones: "Limitados",
        valido: "Válido hasta agotar existencia",
        disponible: "9:00 P.M."
      },
      {
        titulo: "Tienes $4.000",
        subtitulo: "Asi pides #ComoTeGusta",
        expira: new Date(),
        expirtaDes: "La validez ha expirado",
        estado: "finalizado",
        valorCupon: "$4.900",
        valorPedido: "$9.900",
        usoRestaurant: "limitados",
        cupones: "Limitados",
        valido: "Válido hasta agotar existencia",
        disponible: "9:00 P.M."
      },
      {
        titulo: "Tienes $4.000",
        subtitulo: "Asi pides #ComoTeGusta",
        expira: new Date(),
        expirtaDes: "La validez ha expirado",
        estado: "finalizado",
        valorCupon: "$4.900",
        valorPedido: "$9.900",
        usoRestaurant: "limitados",
        cupones: "Limitados",
        valido: "Válido hasta agotar existencia",
        disponible: "9:00 P.M."
      },
    ];
    let listAvisos:any = [
      {
        titulo: "Avisos de pruebas",
        descripcion: "Esta es la descripcion",
        foto: "https://hostel.keralauniversity.ac.in/images/NoImage.jpg"
      },
      {
        titulo: "Avisos de pruebas",
        descripcion: "Esta es la descripcion",
        foto: "https://hostel.keralauniversity.ac.in/images/NoImage.jpg"
      },
      {
        titulo: "Avisos de pruebas",
        descripcion: "Esta es la descripcion",
        foto: "https://hostel.keralauniversity.ac.in/images/NoImage.jpg"
      },
    ];
    let listConfigurarciones:any = [
      {
        titulo: "Editar datos",
        id: "EDITAR DATOS"
      },
      {
        titulo: "Configurar notificaciones",
        id: "CONFIGURAR NOTIFICACIONES"
      },
      {
        titulo: "Sobre esta versión",
        id: "SOBRE ESTA VERSIÓN"
      },
      {
        titulo: "Borrar el historial de busqueda",
      },
      {
        titulo: "Cerrar sesión"
      },
    ];
    let listTipoCocina:any = [
      {
        titulo: "Arepas"
      },
      {
        titulo: "Arabe"
      },
      {
        titulo: "Bebidas"
      },
      {
        titulo: "Crepes"
      },
      {
        titulo: "Comida Rapida"
      },
      {
        titulo: "Desayunos"
      },
      {
        titulo: "Ejecutiva"
      },
      {
        titulo: "Hamburguesas"
      },
      {
        titulo: "Gourmet"
      },
      {
        titulo: "Helados"
      },
      {
        titulo: "Internacional"
      },
      {
        titulo: "Licores"
      },
      {
        titulo: "Mariscos"
      },
      {
        titulo: "Mercado"
      },
      {
        titulo: "Mexicana"
      },
      {
        titulo: "Oriental"
      },
      {
        titulo: "Parrilla"
      },
      {
        titulo: "Pasta"
      },
      {
        titulo: "Picada"
      },
      {
        titulo: "Pizza"
      },
      {
        titulo: "Pollo"
      },
      {
        titulo: "Postres"
      },
      {
        titulo: "Saludable"
      },
      {
        titulo: "Sandwiches"
      },
      {
        titulo: "Sopas"
      },
      {
        titulo: "Sushi"
      },
      {
        titulo: "Tipica"
      }
    ];
    for( let row of listArticulos ){
      row.precioForma = this.convertiendo( row.precio );
      row.precioPromoForma = this.convertiendo( row.precioPromo );
      row.valorDomicilioForma = this.convertiendo( row.valorDomicilio );
    }
    this.dbs = {
      titulo: "Pasteles y Pasteles",
      subtipo: "Tipica",
      foto: "./assets/productos/foto.png",
      distancia: "2,5km",
      rango: "4.4 (19)",
      ordenMinima: "no hay pedido mínimo",
      articulos: listArticulos,
      listMenu: listMenu,
      listRestaurante: listRestaurante,
      listCocinas: listCocinas,
      listCartas: listCartas,
      listOpcion: listOpcion,
      listHistorial: listHistorial,
      tabsBuscador: tabsBuscador,
      listPedidos: listPedidos,
      listFavoritos: listFavoritos,
      listMenus: listMenus,
      listCupones: listCupones,
      listAvisos: listAvisos,
      listConfigurarciones: listConfigurarciones,
      listTipoCocina: listTipoCocina,
      domicilio: {
        icon: "bicycle-outline",
        titulo: "Entregar en 60-70 min",
        precio: "7000"
      },
      horarios: {
        dias: "Miercoles",
        hora: "11:00 a las 20:00",
        listPagos: [
          {
            titulo: "Mastercad",
            foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSId0Av1GgTDGYur7nqDSfg7WU6sjv1ueKjAw&usqp=CAU"
          },
          {
            titulo: "Mastercad",
            foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSId0Av1GgTDGYur7nqDSfg7WU6sjv1ueKjAw&usqp=CAU"
          },
          {
            titulo: "Mastercad",
            foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSId0Av1GgTDGYur7nqDSfg7WU6sjv1ueKjAw&usqp=CAU"
          }
        ],
        listPagosEntrega: [
          {
            titulo: "Efectivo",
            foto: "https://i0.pngocean.com/files/178/28/878/computer-icons-money-bag-bank-clip-art-cash.jpg"
          },
        ]
      },
      listCarta: [
        {
          tipo: "Pasteles Gourmet",
          articulos: listArticulos
        },
        {
          tipo: "Combos",
          articulos: listArticulos
        },
        {
          tipo: "Arepas rellenas",
          articulos: listArticulos
        }
      ]
    };
    

  }

  convertiendo( numero ){
    return this._tools.monedaChange( 3, 2, numero );
  }

  getMenuOpts() {
    return this.http.get<Componente[]>('/assets/data/menu.json');
    //return this._servicio.querys<Component[]>('menu/querys',{},'post');
  }


}
