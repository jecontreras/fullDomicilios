import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    public socketStatus = false;
    public usuario = null;
    public idSocket:string;
    constructor(
        private socket: Socket
    ){
        this.checkStatus();
    }

    checkStatus(){
        this.socket.on('connect',(socket)=>{
            console.log("conectado al servidor", this.socket);
            this.idSocket = this.socket.ioSocket.id;
            this.socketStatus = true;
        });

        this.socket.on('disconnect', (socket)=>{
            console.log("Desconectado del servidor", socket);
            this.socketStatus = false;
        });
    }

    emit( evento: string, payload?:any, callback?: Function){
        console.log("Emitiendo", evento);
        this.socket.emit( evento, payload, callback);
    }

    listen( evento: string ){
        return this.socket.fromEvent( evento );
    }
}