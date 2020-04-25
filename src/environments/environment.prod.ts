import { SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'https://gpssockets.herokuapp.com', options: {} };

export const environment = {
  production: true,
  socketConfig: config,
  url: "https://apigps.herokuapp.com",
  urlServer: "https://gpssockets.herokuapp.com",
  urlActivacion: "https://www.google.com",
  mapbox: {
    accessTokens: "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg"
  },
  urlFront: "https://gpsmaster-d6ee7.firebaseapp.com/",
  vercionApp: "1.0"
  
};
