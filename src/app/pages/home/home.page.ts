import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  searchtxt:string = "";

  slideOpts = {
    slidesPerView: 1,
    freeMode: true
  };

  listCartas:any = [
    {
      foto:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQEXOdnWrzZgtxWzIZyMRMYmJUBZXvKY9egTQ&usqp=CAU",
      descripcion: "¡Pide de 11:00 am a 3:00 pm y disfruta!"
    },
    {
      foto:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ9IC-ciQRfqJf5JJ3MoGAWF9xqdcD7llRGCg&usqp=CAU",
      descripcion: "Descubre algo nuevo"
    }
  ];
  
  slideCosina = {
    slidesPerView: 3,
    freeMode: true
  };

  listCocinas:any = [
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

  listRestaurante:any = [
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000"
    },
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000"
    },
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000"
    },
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000"
    },
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000"
    },
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000"
    },
    {
      foto: "https://i.ytimg.com/vi/aVZ1l7ACkmY/maxresdefault.jpg",
      titulo: "Donde la Negra Costeña",
      rango: "* 4,8 . Tipica . 7,7km",
      detalles: "45-55 min . $ 5.000"
    }
  ];

  listMenu:any = [
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

  constructor() { }

  ngOnInit() {
    console.log( this.listRestaurante );
  }

  search( ){
    console.log( this.searchtxt );
  }

  openFiltro(){

  }

  cambioView( event:any ){
    console.log( event );
  }

}
