import { Action } from "@ngrx/store";

export let NAMEAPP          = '[App] Nameapp';
export let PERSONA          = '[App] Persona';
export let BUSCADOR         = '[App] Buscar';
export let MENUS            = '[App] Menu';
export let CARRITO          = '[App] Carrito';
export let SERVICIOACTIVO   = '[App] ServicioActivo';
export let ORDENACTIVO      = '[App] OrdenActivo';

export class NameappAction implements Action {
    readonly type = NAMEAPP;
    constructor( public payload: object,  public opt: string){}
}

export class PersonaAction implements Action {
    readonly type = PERSONA;
    constructor( public payload: object,  public opt: string){}
}

export class BuscadorAction implements Action {
    readonly type = BUSCADOR;
    constructor( public payload: object,  public opt: string){}
}

export class MenusAction implements Action {
    readonly type = MENUS;
    constructor( public payload: object,  public opt: string){}
}

export class CarritoAction implements Action {
    readonly type = CARRITO;
    constructor( public payload: object,  public opt: string){}
}

export class ServicioActivoAction implements Action {
    readonly type = SERVICIOACTIVO;
    constructor( public payload: object,  public opt: string){}
}

export class OrdenActivoAction implements Action {
    readonly type = ORDENACTIVO;
    constructor( public payload: object,  public opt: string){}
}

export type actions = NameappAction         |
                      PersonaAction         |
                      BuscadorAction        |
                      MenusAction           |
                      CarritoAction         |
                      ServicioActivoAction  |
                      OrdenActivoAction     ;