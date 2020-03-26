// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'https://gpssockets.herokuapp.com', options: {} };

export const environment = {
  production: false,
  socketConfig: config,
  url: "http://localhost:1337",
  urlServer: "https://gpssockets.herokuapp.com",
  mapbox: {
    accessTokens: "pk.eyJ1IjoiamVjb250cmVyYXMiLCJhIjoiY2s3eHBtdnU5MDM4bjNtbWMwNzd6ZnRzNCJ9.xiO6H9iPMJh_PVQOjC2FeA"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
