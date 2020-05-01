// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'https://socketsmanda2.herokuapp.com', options: {} };

export const environment = {
  production: false,
  socketConfig: config,
  url: "https://backendmanda2.herokuapp.com",
  //url: "https://apigps.herokuapp.com",
  // url: "https://17114203.ngrok.io",
  urlServer: "https://socketsmanda2.herokuapp.com",
  urlActivacion: "https://www.google.com",
  mapbox: {
    // pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg
    accessTokens: "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg"
  },
  urlFront: "https://gpsmaster-d6ee7.firebaseapp.com/",
  vercionApp: "1.0"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
