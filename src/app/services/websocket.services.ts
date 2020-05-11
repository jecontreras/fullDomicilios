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

    constructor(
        private socket: Socket,
        private _tools: ToolsService
    ){
        this.checkStatus();
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
            this.socketStatus = false;
            if( this.banderaDesconection ) this.contadorDesconectado();
        });
    }

    emit( evento: string, payload?:any, callback?: Function){
        console.log("Emitiendo", evento);
        this.socket.emit( evento, payload, callback);
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
                this._tools.presentToast("Desconectado del servidor");
                this.socketStatus = true; clearInterval(this.inteval);
                let result = await this._tools.presentAlertConfirm({ mensaje: "!!oops sin conexion refrescar"});
                if(result) { location.reload();}
            }
            contador++;
        }, 1000);
    }
}