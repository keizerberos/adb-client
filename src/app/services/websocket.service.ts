
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private webSocket: Socket;

    servers = null;
    events = {
        servers:[],
        connect:[],
    };
    constructor() {
        this.webSocket = new Socket({
            url: "127.0.0.1:4000",
            options: {},
        });
        
        this.events = {
            servers:[],
            connect:[],
        };
    }
    on(event:string,fn:any){
        this.events[event].push(fn);
    }
    connectSocket(data) {
        this.webSocket.emit('start', data);
        this.initialize();
    }
    initialize() {
        this.webSocket.on('servers',(data)=>{this.getServers(data)});        
        this.webSocket.on('server.changes',(data)=>{this.updateServer(data)});
        this.webSocket.on('server.connect',(data)=>{this.connectServer(data)});
    }
    connectServer(data){
        //console.log("servers",data);
        console.log("connect server",data);
        const server = JSON.parse(data);
        if (this.servers == null)
            this.servers = [server];
		else{
			
            const tempServer = this.servers.find(s=>s.id==server.id);
            if (tempServer==null) {
                this.servers.push(server);
            }else{
                Object.keys(server).forEach(k=>{
                    tempServer[k] = server[k];
                });					
            }
		}
        this.events.connect.forEach(fn=>fn(server));
    }
    getServers(data){
        //console.log("servers",data);
        const servers = JSON.parse(data);
        if (this.servers == null)
            this.servers = servers;
		else{
			servers.forEach(server=>{
				const tempServer = this.servers.find(s=>s.id==server.id);
				if (tempServer==null) {
					this.servers.push(server);
				}else{
					Object.keys(server).forEach(k=>{
						tempServer[k] = server[k];
					});					
				}
			})
		}
        this.events.servers.forEach(fn=>fn(servers));
    }
    updateServer(data){
        console.log("updateServer data",data);
        const dataJson = JSON.parse(data);
        if (this.servers == null ) return;
        const server = this.servers.find(s=>s.id == dataJson.id );        
        if (server == null) return;
        Object.keys(dataJson.changes).forEach(k=>{            
            if ( Array.isArray(dataJson.changes[k]) && Array.isArray(server[k]) ){
                dataJson.changes[k].forEach(a=>server[k].push(a));
            }else{
                server.states[k] = dataJson.changes[k];
            }
        });
    }
    receiveStatus() {
        return this.webSocket.fromEvent('/get-response');
    }

    disconnectSocket() {
        this.webSocket.disconnect();
    }
}