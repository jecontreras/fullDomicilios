import { SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'https://gpssockets.herokuapp.com', options: {} };

export const environment = {
  production: true,
  socketConfig: config,
  url: "https://apigps.herokuapp.com",
  urlServer: "https://gpssockets.herokuapp.com",
  urlActivacion: "https://www.google.com",
  mapbox: {
    accessTokens: "pk.eyJ1IjoiamVjb250cmVyYXMiLCJhIjoiY2s3eHBtdnU5MDM4bjNtbWMwNzd6ZnRzNCJ9.xiO6H9iPMJh_PVQOjC2FeA"
  }
  
};
