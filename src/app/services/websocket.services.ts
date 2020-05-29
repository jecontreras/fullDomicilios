import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToolsService } from './tools.service';
import { async } from '@angular/core/testing';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    public socketStatus = false;
    public usuario = null;
    public idSocket:string;
    banderaDesconection:boolean = true;
    inteval:any;
    eventosRetenidos:any = [];

    constructor(
        private socket: Socket,
        private _tools: ToolsService
    ){
        this.checkStatus();
        this.reEnvio();
    }

    checkStatus(){
        this.socket.on('connect',(socket)=>{
            console.log("conectado al servidor", this.socket);
            this.idSocket = this.socket.ioSocket.id;
            this.socketStatus = true;
            clearInterval( this.inteval );
            this.banderaDesconection = true;
        });

        this.socket.on('disconnect', (socket)=>{
            console.log("Desconectado del servidor", socket);
            //this._tools.presentToast("Desconectado del servidor");
            this.socketStatus = false;
            if( this.banderaDesconection ) this.contadorDesconectado();
        });
    }

    emit( evento: string, payload?:any, callback?: Function, opt:boolean = true){
        console.log("Emitiendo", evento);
        if( this.socketStatus && opt ) this.socket.emit( evento, payload, callback);
        else if( !opt ) this.eventosRetenidos.push({ evento: evento, payload: payload, callback: callback });
    }

    reEnvio(){
        let interval = setInterval(()=>{
            if( !this.socketStatus ) return false;
            for( let row of this.eventosRetenidos ) { 
                if( !this.socketStatus ) continue;
                this.emit( row.evento, row.payload, row.callback, false); 
                row.estado = true;
            }
            this.eventosRetenidos = this.eventosRetenidos.filter( (row:any) => !row.estado );
        }, 5000);
    }

    listen( evento: string ){
        return this.socket.fromEvent( evento );
    }

    contadorDesconectado(){
        let contador:number = 0;
        let limit:number = 10;
        this.inteval = setInterval(async()=>{
            console.log(contador, limit)
            if(contador == limit ) {
                this.socketStatus = true; clearInterval(this.inteval);
                let result = await this._tools.presentAlertConfirm({ mensaje: "!!oops sin conexion refrescar"});
                location.reload();
            }
            contador++;
        }, 1000);
    }
}