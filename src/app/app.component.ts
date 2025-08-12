import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from './services/websocket.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'ServerXState-app';
	servers = null;
	constructor(private websocketService: WebSocketService) { }
	ngOnInit(): void {
		this.initializeSocketConnection();
	}
	ngOnDestroy(): void {
		this.disconnectSocket();
	}
	initializeSocketConnection() {
		this.websocketService.on("servers",(data)=>{			
			if (this.servers == null)
				this.servers = this.websocketService.servers;
			console.log("servidores recibidos",data);
		});
		this.websocketService.connectSocket('servers');
	}
	receiveSocketResponse() {
		this.websocketService.receiveStatus().subscribe((receivedMessage: string) => {
			console.log(receivedMessage);
		});
	}
	disconnectSocket() {
		this.websocketService.disconnectSocket();
	}
}
