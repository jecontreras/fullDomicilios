import { Component, OnInit } from '@angular/core';

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
    domicilio:{
      icon: "bicycle-outline",
      titulo: "Entregar en 60-70 min",
      precio: "$ 7.000"
    },
    listCarta:[
      {
        tipo: "Pasteles Gourmet",
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
  constructor() { }

  ngOnInit() {
  }

}
