
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private webSocket: Socket;

    devices = [];
    tasks = [];
    events = {
        servers:[],
        connect:[],
        devices:[],
        capture:[],
		actions:[],
		progress:[],
        tasks:[],
        disconnect:[],
    };
    constructor() {
        this.webSocket = new Socket({
            url: "172.20.50.123:7000",
            options: {},
        });
        
        this.events = {
            servers:[],
            capture:[],
        	tasks:[],
        	actions:[],
            connect:[],
			progress:[],
            devices:[],
            disconnect:[],
        };
    }
    send(ev,data){
        this.webSocket.emit(ev, data);
    }
    on(event:string,fn:any){
        this.events[event].push(fn);
    }
    connectSocket(data) {
        this.webSocket.emit('start', data);
        this.initialize();
    }
    initialize() {
        this.webSocket.on('cluster.connect',(data)=>{ console.log("cluster.connect",data); });     
        this.webSocket.on('clusters',(data)=>{ console.log("clusters",data); });        
        this.webSocket.on('tasks',(data)=>{ this.receivedTasks(data); console.log("tasks",data); });       
        this.webSocket.on('actions',(data)=>{ this.receivedActions(data); console.log("actions",data); });        
        this.webSocket.on('devices',(data)=>{ this.connectDevices(data); console.log("devices",data); });        
        this.webSocket.on('device.connect',(data)=>{ this.connectDevice(data); console.log("device.connect",data); });
        this.webSocket.on('device.capture',(data)=>{ this.screenDevice(data);  });
        this.webSocket.on('task.progress',(data)=>{ this.taskProgress(data);  });
        this.webSocket.on('device.disconnect',(data)=>{ this.disconnectDevice(data); console.log("device.disconnect",data); });
    }
    screenDevice(data){
        //console.log("screenDevice data",data);
        
        const tempDevice = this.devices.find(s=>s.serial == data.serial);
        if (tempDevice != null) {            
            this.events.capture.forEach(fn=>fn(tempDevice,data.data));
        }
    }
    taskProgress(data){
        console.log("taskProgress data",data);
        
        const tempDevice = this.devices.find(s=>s.serial == data.serial);
        if (tempDevice != null) {    
            data.data.path.forEach(path=>{                
                if (data.data.completed.find(c=>c==path.id)!=undefined ){
                    path['completed'] = true;				
				}else{
                    path['completed'] = false;
				}
                if (data.data.current==path.id)
					path['current'] = true;
				else
					path['current'] = false;
            });
            
            console.log("-- taskProgress data",data);
            tempDevice['progress'] = data.data;
            this.events.progress.forEach(fn=>fn(tempDevice,data.data));
        }
    }
	receivedTasks(data){
		this.events.tasks.forEach(fn=>fn(data));
	}
	receivedActions(data){
		this.events.actions.forEach(fn=>fn(data));
	}
    connectDevice(device){
        console.log("connect device",device);
        console.log("this.devices",this.devices);
        
        const tempDevice = this.devices.find(s=>s.serial == device.serial);
        if (tempDevice == null) {
			device['checked'] = true;
			device['selected'] = 1;
            if (device['progress']!=undefined){
                device['progress'].path.forEach(path=>{                
                    if (device['progress'].completed.find(c=>c==path.id)!=undefined ){
                        path['completed'] = true;				
                    }else{
                        path['completed'] = false;
                    }
                    if (device['progress'].current==path.id)
                        path['current'] = true;
                    else
                        path['current'] = false;
                });
            }

            this.devices.push(device);
        }
        this.events.connect.forEach(fn=>fn(device));
    }
    connectDevices(devices){
        console.log("connect devices",devices);
        devices.forEach(device=>this.connectDevice(device));
        this.events.devices.forEach(fn=>fn(this.devices));
		this.devices.sort((a,b)=>{
			 if (a.number < b.number) 
				return -1;
			if (a.number > b.number) 
				return 1;
			return 0;
		});
    }
    disconnectDevice(device){
        console.log("disconnect device",device);
        
        const tempDevice = this.devices.find(s=>s.serial==device.serial);
        if (tempDevice!=null) {
            this.devices.splice(this.devices.indexOf(tempDevice),1);
        }
        this.events.disconnect.forEach(fn=>fn(device));
    }
    getServers(data){
        //console.log("servers",data);
        const servers = JSON.parse(data);
        if (this.devices == null)
            this.devices = servers;
		else{
			servers.forEach(server=>{
				const tempServer = this.devices.find(s=>s.id==server.id);
				if (tempServer==null) {
					this.devices.push(server);
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
        if (this.devices == null ) return;
        const server = this.devices.find(s=>s.id == dataJson.id );        
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