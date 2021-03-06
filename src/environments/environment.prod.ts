import { SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'https://gpssockets.herokuapp.com', options: {} };

export const environment = {
  production: true,
  socketConfig: config,
  url: "https://apigps.herokuapp.com",
  urlServer: "https://gpssockets.herokuapp.com",
  urlActivacion: "https://www.google.com",
  mapbox: {
    accessTokens: ""
  },
  urlFront: "https://gpsmaster-d6ee7.firebaseapp.com/",
  vercionApp: "1.0"
  
};
