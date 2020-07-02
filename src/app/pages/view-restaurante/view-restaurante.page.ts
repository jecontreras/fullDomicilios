import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetalleProductoPage } from 'src/app/dialog/detalle-producto/detalle-producto.page';

@Component({
  selector: 'app-view-restaurante',
  templateUrl: './view-restaurante.page.html',
  styleUrls: ['./view-restaurante.page.scss'],
})
export class ViewRestaurantePage implements OnInit {
  
  restaurante:string = "";
  data:any = {
    titulo: "Pasteles y Pasteles",
    subtipo: "Tipica",
    foto: "./assets/productos/foto.png",
    distancia: "2,5km",
    rango: "4.4 (19)",
    ordenMinima: "no hay pedido mínimo",
    domicilio:{
      icon: "bicycle-outline",
      titulo: "Entregar en 60-70 min",
      precio: "$ 7.000"
    },
    horarios:{
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
    listCarta:[
      {
        tipo: "Pasteles Gourmet",
        articulos:[
          {
            titulo: "Pastel Ranchero",
            descripcion: "Salchicha ranchera de zenú con jamón y queso mozarella",
            precio: "$ 6.700",
            precioAnt: "$ 8.000",
            restaurante: {},
            tiempo: "60-70 min",
            foto: "https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg"
          },
          {
            titulo: "Pastel Ranchero",
            descripcion: "Salchicha ranchera de zenú con jamón y queso mozarella",
            precio: "$ 6.700",
            precioAnt: "$ 8.000",
            restaurante: {},
            tiempo: "60-70 min",
            foto: "https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg"
          },
          {
            titulo: "Pastel Ranchero",
            descripcion: "Salchicha ranchera de zenú con jamón y queso mozarella",
            precio: "$ 6.700",
            precioAnt: "$ 8.000",
            restaurante: {},
            tiempo: "60-70 min",
            foto: "https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg"
          }
        ]
      },
      {
        tipo: "Combos",
        articulos:[
          {
            titulo: "Pastel Ranchero",
            descripcion: "Salchicha ranchera de zenú con jamón y queso mozarella",
            precio: "$ 6.700",
            foto: "https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg"
          },
          {
            titulo: "Pastel Ranchero",
            descripcion: "Salchicha ranchera de zenú con jamón y queso mozarella",
            precio: "$ 6.700",
            foto: "https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg"
          },
          {
            titulo: "Pastel Ranchero",
            descripcion: "Salchicha ranchera de zenú con jamón y queso mozarella",
            precio: "$ 6.700",
            foto: "https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg"
          }
        ]
      },
      {
        tipo: "Arepas rellenas",
        articulos:[
          {
            titulo: "Pastel Ranchero",
            descripcion: "Salchicha ranchera de zenú con jamón y queso mozarella",
            precio: "$ 6.700",
            foto: "https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg"
          },
          {
            titulo: "Pastel Ranchero",
            descripcion: "Salchicha ranchera de zenú con jamón y queso mozarella",
            precio: "$ 6.700",
            foto: "https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg"
          },
          {
            titulo: "Pastel Ranchero",
            descripcion: "Salchicha ranchera de zenú con jamón y queso mozarella",
            precio: "$ 6.700",
            foto: "https://previews.123rf.com/images/visionsi/visionsi1410/visionsi141000476/32943570-plato-sano-de-carnes-mixtas-incluyendo-bistec-a-la-parrilla-comida-balc%C3%A1nica.jpg"
          }
        ]
      }
    ]
  };
  id:any = "";
  vista:string = "home";

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async openProducto( obj:any ){
    console.log( obj );
    const modal = await this.modalCtrl.create({
      component: DetalleProductoPage,
      componentProps: { obj },
    });
    modal.present();
  }
  

}
