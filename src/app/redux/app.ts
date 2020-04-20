// app.ts

import * as _action from './app.actions';
import * as _ from 'lodash';
import { STORAGES } from '../interfas/sotarage';

let APP = dropt();
let data:any;
function dropt(){
  let data_stora:STORAGES = {};
  return data_stora;
}
export function appReducer(state: STORAGES = APP, action: _action.actions) {
  if(JSON.parse(localStorage.getItem('APP'))) {
    state = JSON.parse(localStorage.getItem('APP'));
    validacion_key(state);
  }
  else {
    localStorage.removeItem('APP');
    localStorage.setItem('APP', JSON.stringify(state));
  }
  // console.log(state);
  function local_Storage(APP){
    localStorage.removeItem('APP');
    localStorage.setItem('APP', JSON.stringify(APP));
    state = JSON.parse(localStorage.getItem('APP'));
    return state
  }
  function proceso_data(lista:any, data:any, opt){
    let idx = _.findIndex(lista, ['id', data.id]);
    if(idx >-1 && opt != 'post'){
      if(opt === 'delete') lista.splice(idx, 1);
      else lista[idx]= data;
    }else{
      if(opt === 'post') lista.push(data);
    }
    return lista;
  }
  function validacion_key(state: STORAGES){
    //if(!state.articulos) state.articulos = [];
    if(!state.persona) state.persona = {};
    if(!state.buscador) state.buscador = {};
    if(!state.menus) state.menus = [];
    if(!state.carrito) state.carrito = [];
  }
  switch (action.type) {
    case _action.NAMEAPP: {
      switch(action.opt) {
        case 'post' :
          if(!state.APP) state.APP = {};
            state.APP = action.payload;
            return local_Storage(state);
        break;
        case 'put': {
          state.APP = action.payload;
        }
        return local_Storage(state);
        break;
        case 'delete': 
          state.APP = {};
          return local_Storage(state);
        break;
        case 'drop': {
          state.APP = {};
          return local_Storage(state);
        }
        break;
      }
    }
    case _action.PERSONA: {
      switch(action.opt) {
        case 'post' :
          if(!state.persona) state.persona = {};
            state.persona = action.payload;
            return local_Storage(state);
        break;
        case 'put': {
          state.persona = action.payload;
        }
        return local_Storage(state);
        break;
        case 'delete': 
          state.persona = {};
          return local_Storage(state);
        break;
        case 'drop': {
          state.persona = {};
          return local_Storage(state);
        }
        break;
      }
    }
    case _action.BUSCADOR: {
      switch(action.opt) {
        case 'post' :
          if(!state.buscador) state.buscador = {};
            state.buscador = action.payload;
            return local_Storage(state);
        break;
        case 'put': {
          state.buscador = action.payload;
        }
        return local_Storage(state);
        break;
        case 'delete': 
          console.log(action.opt)
          state.buscador = {};
          return local_Storage(state);
        break;
        case 'drop': {
          state.buscador = {};
          return local_Storage(state);
        }
        break;
      }
    }
    case _action.MENUS:{
      switch (action.opt){
        case 'post': {
          // console.log(action.payload);
          if(!state.menus) state.menus = [];
          data = proceso_data(state.menus,action.payload, 'post');
          state.menus = data;
          return local_Storage(state);
        }
        break;
        case 'put': {
          data = proceso_data(state.menus,action.payload, 'put');
          state.menus = data;
          return local_Storage(state);
        }
        break;
        case 'delete': {
          data = proceso_data(state.menus,action.payload, 'delete');
          state.menus = data;
          return local_Storage(state);
        }
        break;
        case 'drop': {
          state.menus = [];
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    case _action.CARRITO:{
      switch (action.opt){
        case 'post': {
          // console.log(action.payload);
          if(!state.carrito) state.carrito = [];
          data = proceso_data(state.carrito,action.payload, 'post');
          state.carrito = data;
          return local_Storage(state);
        }
        break;
        case 'put': {
          data = proceso_data(state.carrito,action.payload, 'put');
          state.carrito = data;
          return local_Storage(state);
        }
        break;
        case 'delete': {
          data = proceso_data(state.carrito,action.payload, 'delete');
          state.carrito = data;
          return local_Storage(state);
        }
        break;
        case 'drop': {
          state.carrito = [];
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    case _action.SERVICIOACTIVO:{
      switch (action.opt){
        case 'post': {
          // console.log(action.payload);
          if(!state.servicioActivo) state.servicioActivo = [];
          let data = _.find( state.servicioActivo, (row:any) => row.id == action.payload['id'] );
          if(!data){
            data = proceso_data(state.servicioActivo,action.payload, 'post');
            state.servicioActivo = data;
          }
          return local_Storage(state);
        }
        break;
        case 'put': {
          data = proceso_data(state.servicioActivo,action.payload, 'put');
          state.servicioActivo = data;
          return local_Storage(state);
        }
        break;
        case 'delete': {
          data = proceso_data(state.servicioActivo,action.payload, 'delete');
          state.servicioActivo = data;
          return local_Storage(state);
        }
        break;
        case 'drop': {
          state.servicioActivo = [];
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    case _action.ORDENACTIVO:{
      switch (action.opt){
        case 'post': {
          // console.log(action.payload);
          if(!state.ordenactivo) state.ordenactivo = [];
          let data = _.find( state.ordenactivo, (row:any) => row.id == action.payload['id'] );
          if(!data){
            data = proceso_data(state.ordenactivo,action.payload, 'post');
            state.ordenactivo = data;
          }
          return local_Storage(state);
        }
        break;
        case 'put': {
          data = proceso_data(state.ordenactivo,action.payload, 'put');
          state.ordenactivo = data;
          return local_Storage(state);
        }
        break;
        case 'delete': {
          data = proceso_data(state.ordenactivo,action.payload, 'delete');
          state.ordenactivo = data;
          return local_Storage(state);
        }
        break;
        case 'drop': {
          state.ordenactivo = [];
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    case _action.NOTIFICACIONES:{
      switch (action.opt){
        case 'post': {
          // console.log(action.payload);
          if(!state.notificaciones) state.notificaciones = [];
          let data = _.find( state.notificaciones, (row:any) => row.id == action.payload['id'] );
          if(!data){
            data = proceso_data(state.notificaciones,action.payload, 'post');
            state.notificaciones = data;
          }
          return local_Storage(state);
        }
        break;
        case 'put': {
          data = proceso_data(state.notificaciones,action.payload, 'put');
          state.notificaciones = data;
          return local_Storage(state);
        }
        break;
        case 'delete': {
          data = proceso_data(state.notificaciones,action.payload, 'delete');
          state.notificaciones = data;
          return local_Storage(state);
        }
        break;
        case 'drop': {
          state.notificaciones = [];
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    default: return state;
  }
}
