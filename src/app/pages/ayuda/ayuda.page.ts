import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss'],
})
export class AyudaPage implements OnInit {

  constructor(
    private iab: InAppBrowser,
  ) { 
    const browser = this.iab.create("https://dilisoft-f16d2.web.app/", '_system');
  }

  ngOnInit() {}

}
