import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.page.html',
  styleUrls: ['./soporte.page.scss'],
})
export class SoportePage implements OnInit {

  constructor(
    private iab: InAppBrowser,
  ) { }

  ngOnInit() {
    const browser = this.iab.create("https://dilisoft-f16d2.web.app/", '_system');
  }

}
